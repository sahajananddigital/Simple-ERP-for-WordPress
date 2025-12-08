/**
 * Food Pass Module App
 */
import { useState, useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	Card,
	CardBody,
	CardHeader,
	Button,
	TextControl,
	Spinner,
	Notice,
	Flex,
	FlexBlock,
	TabPanel,
} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

const FoodPassApp = ( { view = 'create' } ) => {
	const [ foodPasses, setFoodPasses ] = useState( [] );
	const [ loading, setLoading ] = useState( true );
	const [ error, setError ] = useState( null );
	const [ isCreating, setIsCreating ] = useState( false );
	const [ activeTab, setActiveTab ] = useState(
		view === 'list' ? 'list' : 'create'
	);

	// Form State
	const [ quantity, setQuantity ] = useState( 1 );
	const [ rate ] = useState( 90 ); // Default rate from screenshot
	const [ total, setTotal ] = useState( 90 );

	// Print State
	const [ showReceipt, setShowReceipt ] = useState( false );
	const [ lastPrintedPass, setLastPrintedPass ] = useState( null );
	const receiptRef = useRef( null );

	// Report State
	const [ reportStartDate, setReportStartDate ] = useState( '' );
	const [ reportEndDate, setReportEndDate ] = useState( '' );
	const [ reportFilterType, setReportFilterType ] = useState( 'all' ); // all, lunch, dinner

	// Initialize dates to current month on mount
	useEffect( () => {
		const now = new Date();
		const firstDay = new Date( now.getFullYear(), now.getMonth(), 1 )
			.toISOString()
			.split( 'T' )[ 0 ];
		const lastDay = new Date( now.getFullYear(), now.getMonth() + 1, 0 )
			.toISOString()
			.split( 'T' )[ 0 ];
		setReportStartDate( firstDay );
		setReportEndDate( lastDay );
	}, [] );

	useEffect( () => {
		if ( activeTab === 'list' ) {
			fetchFoodPasses();
		}
	}, [ activeTab ] );

	// Update total when quantity changes
	useEffect( () => {
		setTotal( quantity * rate );
	}, [ quantity, rate ] );

	const fetchFoodPasses = async () => {
		setLoading( true );
		setError( null );
		try {
			const data = await apiFetch( {
				path: '/wp-erp/v1/food-pass',
			} );
			setFoodPasses( data );
		} catch ( err ) {
			setError(
				err.message || __( 'Failed to fetch food passes', 'wp-erp' )
			);
		} finally {
			setLoading( false );
		}
	};

	const getMealType = ( dateObj ) => {
		const hours = dateObj.getHours();
		// If before 4 PM (16:00), consider it Lunch, else Dinner
		return hours < 16 ? 'Lunch' : 'Dinner';
	};

	const handlePrint = async ( e ) => {
		e.preventDefault();
		setIsCreating( true );
		setError( null );

		const now = new Date();
		const today = now.toISOString().split( 'T' )[ 0 ];
		const currentTime = now.toLocaleTimeString( [], {
			hour: '2-digit',
			minute: '2-digit',
		} );
		const mealType = getMealType( now );

		// Prepare data for UI (Receipt)
		const receiptData = {
			quantity: parseInt( quantity ),
			amount: total,
			date: today,
			time: currentTime,
			rate: rate,
			mealType: mealType,
			id: 'PENDING...',
		};

		// Optimistic UI: Prepare receipt immediately
		setLastPrintedPass( receiptData );
		setShowReceipt( true );

		// Trigger Print after a slight delay to allow rendering
		setTimeout( () => {
			window.print();
		}, 500 );

		// Prepare data for Backend (DB Schema compliance)
		const apiPayload = {
			issue_date: today,
			valid_from: today,
			valid_to: today,
			total_meals: parseInt( quantity ),
			meals_per_day: parseInt( quantity ),
			status: 'active',
			// Store extra print data in notes since DB lacks these columns
			notes: JSON.stringify( {
				amount: total,
				rate: rate,
				time: currentTime,
				mealType: mealType,
			} ),
		};

		try {
			// Save in background/after print dialog
			const savedPass = await apiFetch( {
				path: '/wp-erp/v1/food-pass',
				method: 'POST',
				data: apiPayload,
			} );

			// Update with actual ID
			setLastPrintedPass( ( prev ) => ( { ...prev, id: savedPass.id } ) );
			fetchFoodPasses();

			// Reset form
			setQuantity( 1 );
		} catch ( err ) {
			setError(
				// err.message || __( 'Failed to save food pass (Data queued)', 'wp-erp' )
				// Show more detailed error if available to help debugging
				err.message && err.data?.status
					? `${ err.message } (${ err.data.status })`
					: err.message || __( 'Failed to save food pass', 'wp-erp' )
			);
		} finally {
			setIsCreating( false );
		}
	};

	const getStatusColor = ( status ) => {
		switch ( status ) {
			case 'active':
				return '#00a32a';
			case 'expired':
				return '#d63638';
			default:
				return '#757575';
		}
	};

	const getDashboardStats = () => {
		const now = new Date();
		const today = now.toISOString().split( 'T' )[ 0 ];
		const currentMonth = now.getMonth();
		const currentYear = now.getFullYear();

		const lastMonthDate = new Date(
			now.getFullYear(),
			now.getMonth() - 1,
			1
		);
		const lastMonth = lastMonthDate.getMonth();
		const lastMonthYear = lastMonthDate.getFullYear();

		const stats = {
			today: { lunch: 0, dinner: 0, total: 0 },
			thisMonth: { count: 0, amount: 0 },
			lastMonth: { count: 0, amount: 0 },
		};

		foodPasses.forEach( ( pass ) => {
			const passDate = new Date( pass.issue_date );
			const passMonth = passDate.getMonth();
			const passYear = passDate.getFullYear();

			// Calculate Amount
			let amount = 0;
			let mealType = 'Lunch';
			try {
				const notesData = pass.notes ? JSON.parse( pass.notes ) : {};
				if ( notesData.amount ) {
					amount = parseFloat( notesData.amount );
				} else {
					amount = ( parseInt( pass.total_meals ) || 0 ) * 90;
				}
				if ( notesData.mealType ) mealType = notesData.mealType;
			} catch ( e ) {
				amount = ( parseInt( pass.total_meals ) || 0 ) * 90;
			}

			const quantity = parseInt( pass.total_meals || 0 );

			// Today's Stats
			if ( pass.issue_date === today ) {
				if ( mealType === 'Lunch' ) stats.today.lunch += quantity;
				if ( mealType === 'Dinner' ) stats.today.dinner += quantity;
				stats.today.total += quantity;
			}

			// This Month's Stats
			if ( passMonth === currentMonth && passYear === currentYear ) {
				stats.thisMonth.count += quantity;
				stats.thisMonth.amount += amount;
			}

			// Last Month's Stats
			if ( passMonth === lastMonth && passYear === lastMonthYear ) {
				stats.lastMonth.count += quantity;
				stats.lastMonth.amount += amount;
			}
		} );
		return stats;
	};

	const getFilteredReports = () => {
		if ( ! reportStartDate || ! reportEndDate ) return [];

		const start = new Date( reportStartDate );
		const end = new Date( reportEndDate );
		// Set end date to end of day to include the full day
		end.setHours( 23, 59, 59, 999 );

		return foodPasses.filter( ( pass ) => {
			const passDate = new Date( pass.issue_date );
			// Date Filter
			if ( passDate < start || passDate > end ) return false;

			// Meal Type Filter
			if ( reportFilterType !== 'all' ) {
				let mealType = 'Lunch';
				try {
					const notesData = pass.notes
						? JSON.parse( pass.notes )
						: {};
					if ( notesData.mealType ) mealType = notesData.mealType;
				} catch ( e ) {}

				if ( mealType.toLowerCase() !== reportFilterType.toLowerCase() )
					return false;
			}

			return true;
		} );
	};

	const renderReports = () => {
		const filteredData = getFilteredReports();

		// Calculate Stats for Filtered Data
		let totalQty = 0;
		let totalRevenue = 0;
		let lunchCount = 0;
		let dinnerCount = 0;

		filteredData.forEach( ( pass ) => {
			const qty = parseInt( pass.total_meals || 0 );
			let revenue = 0;
			let type = 'Lunch';

			try {
				const notesData = pass.notes ? JSON.parse( pass.notes ) : {};
				if ( notesData.amount )
					revenue = parseFloat( notesData.amount );
				else revenue = qty * 90;
				if ( notesData.mealType ) type = notesData.mealType;
			} catch ( e ) {
				revenue = qty * 90;
			}

			totalQty += qty;
			totalRevenue += revenue;
			if ( type === 'Lunch' ) lunchCount += qty;
			if ( type === 'Dinner' ) dinnerCount += qty;
		} );

		return (
			<div className="food-pass-reports">
				{ /* Filters */ }
				<Card style={ { marginBottom: '20px', padding: '20px' } }>
					<Flex gap={ 4 } align="end" wrap={ true }>
						<FlexBlock>
							<TextControl
								label={ __( 'Start Date', 'wp-erp' ) }
								type="date"
								value={ reportStartDate }
								onChange={ ( val ) =>
									setReportStartDate( val )
								}
							/>
						</FlexBlock>
						<FlexBlock>
							<TextControl
								label={ __( 'End Date', 'wp-erp' ) }
								type="date"
								value={ reportEndDate }
								onChange={ ( val ) => setReportEndDate( val ) }
							/>
						</FlexBlock>
						<FlexBlock>
							<div className="components-base-control">
								<label
									className="components-base-control__label"
									style={ {
										marginBottom: '8px',
										display: 'block',
									} }
								>
									{ __( 'Meal Type', 'wp-erp' ) }
								</label>
								<select
									value={ reportFilterType }
									onChange={ ( e ) =>
										setReportFilterType( e.target.value )
									}
									style={ {
										width: '100%',
										height: '40px',
										borderColor: '#757575',
										borderRadius: '4px',
										padding: '0 8px',
									} }
								>
									<option value="all">
										{ __( 'All Types' ) }
									</option>
									<option value="lunch">
										{ __( 'Lunch' ) }
									</option>
									<option value="dinner">
										{ __( 'Dinner' ) }
									</option>
								</select>
							</div>
						</FlexBlock>
						<FlexBlock style={ { flex: '0 0 auto' } }>
							<Button
								variant="secondary"
								onClick={ () => {
									// Quick Range: Today
									const today = new Date()
										.toISOString()
										.split( 'T' )[ 0 ];
									setReportStartDate( today );
									setReportEndDate( today );
								} }
							>
								{ __( 'Today' ) }
							</Button>
						</FlexBlock>
					</Flex>
				</Card>

				{ /* Stats Cards */ }
				<Flex gap={ 4 } style={ { marginBottom: '20px' } }>
					<FlexBlock>
						<Card
							style={ {
								padding: '20px',
								textAlign: 'center',
								borderTop: '4px solid #2271b1',
							} }
						>
							<div
								style={ {
									color: '#646970',
									fontSize: '13px',
									textTransform: 'uppercase',
								} }
							>
								{ __( 'Total Revenue' ) }
							</div>
							<div
								style={ {
									fontSize: '28px',
									fontWeight: 'bold',
									color: '#101517',
								} }
							>
								₹{ totalRevenue.toLocaleString( 'en-IN' ) }
							</div>
						</Card>
					</FlexBlock>
					<FlexBlock>
						<Card
							style={ {
								padding: '20px',
								textAlign: 'center',
								borderTop: '4px solid #00a32a',
							} }
						>
							<div
								style={ {
									color: '#646970',
									fontSize: '13px',
									textTransform: 'uppercase',
								} }
							>
								{ __( 'Passes Sold' ) }
							</div>
							<div
								style={ {
									fontSize: '28px',
									fontWeight: 'bold',
								} }
							>
								{ totalQty }
							</div>
							<div
								style={ {
									fontSize: '12px',
									color: '#757575',
									marginTop: '4px',
								} }
							>
								{ lunchCount } Lunch • { dinnerCount } Dinner
							</div>
						</Card>
					</FlexBlock>
				</Flex>

				{ /* Detailed Filtered Table */ }
				{ filteredData.length > 0 ? (
					<div
						style={ {
							overflowX: 'auto',
							background: '#fff',
							border: '1px solid #e0e0e0',
						} }
					>
						<table className="wp-list-table widefat fixed striped">
							<thead>
								<tr>
									<th>{ __( 'Pass ID', 'wp-erp' ) }</th>
									<th>{ __( 'Date', 'wp-erp' ) }</th>
									<th>{ __( 'Meal Type', 'wp-erp' ) }</th>
									<th>{ __( 'Quantity', 'wp-erp' ) }</th>
									<th>{ __( 'Amount', 'wp-erp' ) }</th>
								</tr>
							</thead>
							<tbody>
								{ filteredData.map( ( pass ) => {
									let amount = '-';
									let mealType = '-';
									try {
										const notesData = pass.notes
											? JSON.parse( pass.notes )
											: {};
										if ( notesData.amount )
											amount = `₹${ notesData.amount }`;
										else if ( pass.total_meals )
											amount = `₹${
												pass.total_meals * 90
											}`;
										mealType =
											notesData.mealType || 'Lunch';
									} catch ( e ) {
										amount = `₹${ pass.total_meals * 90 }`;
										mealType = 'Lunch';
									}

									return (
										<tr key={ pass.id }>
											<td>
												<strong>{ pass.id }</strong>
											</td>
											<td>{ pass.issue_date }</td>
											<td>
												<span
													style={ {
														padding: '2px 6px',
														borderRadius: '4px',
														background:
															mealType === 'Lunch'
																? '#e5f5fa'
																: '#fcf0f1',
														color:
															mealType === 'Lunch'
																? '#00869d'
																: '#d63638',
														fontWeight: '500',
													} }
												>
													{ mealType }
												</span>
											</td>
											<td>{ pass.total_meals }</td>
											<td>{ amount }</td>
										</tr>
									);
								} ) }
							</tbody>
						</table>
					</div>
				) : (
					<div
						style={ {
							padding: '40px',
							textAlign: 'center',
							color: '#757575',
							background: '#fff',
							border: '1px solid #e0e0e0',
						} }
					>
						{ __(
							'No records found for the selected range.',
							'wp-erp'
						) }
					</div>
				) }
			</div>
		);
	};

	const renderFoodPassesList = () => {
		const stats = getDashboardStats();

		if ( loading ) {
			return (
				<Flex justify="center" style={ { padding: '32px' } }>
					<Spinner />
				</Flex>
			);
		}

		return (
			<div>
				{ /* Dashboard Stats Summary */ }
				<Card
					style={ {
						marginBottom: '20px',
						backgroundColor: '#fff',
						border: '1px solid #e0e0e0',
					} }
				>
					<CardBody>
						{ /* Monthly Insights */ }
						<h4
							style={ {
								margin: '0 0 10px 0',
								fontSize: '13px',
								color: '#757575',
								textTransform: 'uppercase',
							} }
						>
							{ __( 'Monthly Performance' ) }
						</h4>
						<Flex gap={ 4 }>
							<FlexBlock>
								<div
									style={ {
										border: '1px solid #e0e0e0',
										padding: '15px',
										borderRadius: '8px',
									} }
								>
									<div
										style={ {
											fontSize: '12px',
											color: '#646970',
											marginBottom: '4px',
										} }
									>
										{ __( 'This Month' ) }
									</div>
									<Flex
										justify="flex-start"
										gap={ 3 }
										align="baseline"
									>
										<div
											style={ {
												fontSize: '24px',
												fontWeight: 'bold',
												color: '#101517',
											} }
										>
											₹
											{ stats.thisMonth.amount.toLocaleString(
												'en-IN'
											) }
										</div>
										<div
											style={ {
												fontSize: '13px',
												color: '#757575',
											} }
										>
											({ stats.thisMonth.count } Passes)
										</div>
									</Flex>
								</div>
							</FlexBlock>
							<FlexBlock>
								<div
									style={ {
										border: '1px solid #e0e0e0',
										padding: '15px',
										borderRadius: '8px',
									} }
								>
									<div
										style={ {
											fontSize: '12px',
											color: '#646970',
											marginBottom: '4px',
										} }
									>
										{ __( 'Last Month' ) }
									</div>
									<Flex
										justify="flex-start"
										gap={ 3 }
										align="baseline"
									>
										<div
											style={ {
												fontSize: '24px',
												fontWeight: 'bold',
												color: '#646970',
											} }
										>
											₹
											{ stats.lastMonth.amount.toLocaleString(
												'en-IN'
											) }
										</div>
										<div
											style={ {
												fontSize: '13px',
												color: '#757575',
											} }
										>
											({ stats.lastMonth.count } Passes)
										</div>
									</Flex>
								</div>
							</FlexBlock>
						</Flex>
					</CardBody>
				</Card>

				{ foodPasses.length === 0 ? (
					<p
						style={ {
							padding: '16px',
							textAlign: 'center',
							color: '#757575',
						} }
					>
						{ __( 'No food passes found.', 'wp-erp' ) }
					</p>
				) : (
					<div style={ { overflowX: 'auto' } }>
						<table className="wp-list-table widefat fixed striped">
							<thead>
								<tr>
									<th>{ __( 'Pass ID', 'wp-erp' ) }</th>
									<th>{ __( 'Date', 'wp-erp' ) }</th>
									<th>{ __( 'Meal Type', 'wp-erp' ) }</th>
									<th>{ __( 'Quantity', 'wp-erp' ) }</th>
									<th>{ __( 'Amount', 'wp-erp' ) }</th>
								</tr>
							</thead>
							<tbody>
								{ foodPasses.map( ( pass ) => {
									// Parse notes to get amount/rate if available
									let amount = '-';
									let mealType = '-';
									try {
										const notesData = pass.notes
											? JSON.parse( pass.notes )
											: {};
										if ( notesData.amount ) {
											amount = `₹${ notesData.amount }`;
										} else if ( pass.total_meals ) {
											// Fallback if data not in notes (legacy/manual entry)
											amount = `₹${
												pass.total_meals * 90
											}`;
										}

										if ( notesData.mealType ) {
											mealType = notesData.mealType;
										} else {
											// Fallback inference if missing
											mealType = 'Lunch'; // Legacy default
										}
									} catch ( e ) {
										// Legacy plain text notes or error
										if ( pass.total_meals ) {
											amount = `₹${
												pass.total_meals * 90
											}`;
											mealType = 'Lunch';
										}
									}

									return (
										<tr key={ pass.id }>
											<td>
												<strong>{ pass.id }</strong>
											</td>
											<td>{ pass.issue_date }</td>
											<td>
												<span
													style={ {
														padding: '2px 6px',
														borderRadius: '4px',
														background:
															mealType === 'Lunch'
																? '#e5f5fa'
																: '#fcf0f1',
														color:
															mealType === 'Lunch'
																? '#00869d'
																: '#d63638',
														fontWeight: '500',
													} }
												>
													{ mealType }
												</span>
											</td>
											<td>{ pass.total_meals }</td>
											<td>{ amount }</td>
										</tr>
									);
								} ) }
							</tbody>
						</table>
					</div>
				) }
			</div>
		);
	};

	const renderCreateFoodPass = () => {
		return (
			<Card style={ { marginBottom: '24px', maxWidth: '400px' } }>
				<CardHeader>
					<h2 style={ { margin: 0 } }>
						{ __( 'Food Pass', 'wp-erp' ) }
					</h2>
				</CardHeader>
				<CardBody>
					<form onSubmit={ handlePrint }>
						<Flex direction="column" gap={ 4 }>
							<FlexBlock>
								<TextControl
									label={ __( 'Quantity:', 'wp-erp' ) }
									type="number"
									min="1"
									value={ quantity }
									onChange={ ( value ) =>
										setQuantity( value )
									}
									required
								/>
							</FlexBlock>
							<FlexBlock>
								<TextControl
									label={ __(
										'Total Amount to Pay:',
										'wp-erp'
									) }
									value={ `₹${ total }` }
									readOnly
									help={ __(
										'Rate: ₹90 per meal',
										'wp-erp'
									) }
								/>
							</FlexBlock>

							<Flex justify="flex-start">
								<Button
									variant="primary"
									type="submit"
									isBusy={ isCreating }
								>
									{ __( 'Print Food Pass', 'wp-erp' ) }
								</Button>
							</Flex>

							<p
								style={ {
									fontSize: '12px',
									color: '#646970',
									margin: 0,
								} }
							>
								{ __(
									'Prints instantly; data queued for syncing.',
									'wp-erp'
								) }
							</p>
						</Flex>
					</form>
				</CardBody>
			</Card>
		);
	};

	return (
		<div className="wp-erp-food-pass" style={ { padding: '16px' } }>
			{ /* Print Receipt Style & Structure */ }
			{ showReceipt && lastPrintedPass && (
				<div
					className="food-pass-receipt"
					ref={ receiptRef }
					style={ {
						display: 'none', // Hidden on screen, shown in print via media query
						fontFamily: 'monospace',
						width: '300px',
						margin: '0 auto',
						padding: '20px',
						border: '1px solid #000',
					} }
				>
					<style>
						{ `
							@media print {
								body * {
									visibility: hidden;
								}
								.food-pass-receipt, .food-pass-receipt * {
									visibility: visible;
								}
								.food-pass-receipt {
									display: block !important;
									position: absolute;
									left: 0;
									top: 0;
									width: 100%;
								}
							}
						` }
					</style>

					<div
						style={ {
							textAlign: 'center',
							borderBottom: '1px dashed #000',
							paddingBottom: '10px',
							marginBottom: '10px',
						} }
					>
						<h3 style={ { margin: '0 0 5px 0' } }>
							Shree Swaminarayan Gurukul
						</h3>
						<div
							style={ {
								borderTop: '1px dashed #000',
								margin: '5px auto',
								width: '80%',
							} }
						></div>
						<h4 style={ { margin: 0 } }>🍲 FOOD PASS 🍲</h4>
						<div
							style={ {
								borderTop: '1px dashed #000',
								margin: '5px auto',
								width: '80%',
							} }
						></div>
					</div>

					<table style={ { width: '100%', lineHeight: '1.5' } }>
						<tbody>
							<tr>
								<td>
									<strong>ID</strong>
								</td>
								<td>: { lastPrintedPass.id }</td>
							</tr>
							<tr>
								<td>
									<strong>Date</strong>
								</td>
								<td>: { lastPrintedPass.date }</td>
							</tr>
							<tr>
								<td>
									<strong>Time</strong>
								</td>
								<td>: { lastPrintedPass.time }</td>
							</tr>
							<tr>
								<td>
									<strong>Type</strong>
								</td>
								<td>: { lastPrintedPass.mealType }</td>
							</tr>
							<tr>
								<td>
									<strong>Quantity</strong>
								</td>
								<td>: { lastPrintedPass.quantity }</td>
							</tr>
							<tr>
								<td>
									<strong>Rate</strong>
								</td>
								<td>: ₹{ lastPrintedPass.rate }</td>
							</tr>
						</tbody>
					</table>

					<div
						style={ {
							borderTop: '1px dashed #000',
							margin: '10px 0',
							paddingTop: '5px',
						} }
					>
						<div
							style={ {
								display: 'flex',
								justifyContent: 'space-between',
								fontWeight: 'bold',
							} }
						>
							<span>Total</span>
							<span>: ₹{ lastPrintedPass.amount }</span>
						</div>
					</div>

					<div style={ { textAlign: 'center', marginTop: '20px' } }>
						<p>🙏🏻 Jay Swaminarayan 🙏🏻</p>
					</div>
				</div>
			) }

			{ error && (
				<Notice
					status="error"
					isDismissible={ false }
					onRemove={ () => setError( null ) }
				>
					{ error }
				</Notice>
			) }

			<Card>
				<CardHeader>
					<h2 style={ { margin: 0 } }>
						{ __( 'Food Pass Management', 'wp-erp' ) }
					</h2>
				</CardHeader>
				<CardBody>
					<TabPanel
						className="wp-erp-food-pass-tabs"
						activeClass="is-active"
						initialTabName={ activeTab }
						onSelect={ ( tabName ) => setActiveTab( tabName ) }
						tabs={ [
							{
								name: 'create',
								title: __( 'Create Food Pass', 'wp-erp' ),
								className: 'tab-create',
							},
							{
								name: 'list',
								title: __( 'All Food Passes', 'wp-erp' ),
								className: 'tab-list',
							},
							{
								name: 'reports',
								title: __( 'Reports', 'wp-erp' ),
								className: 'tab-reports',
							},
						] }
					>
						{ ( tab ) => {
							if ( tab.name === 'list' ) {
								return renderFoodPassesList();
							} else if ( tab.name === 'reports' ) {
								return renderReports();
							}
							return renderCreateFoodPass();
						} }
					</TabPanel>
				</CardBody>
			</Card>
		</div>
	);
};

export default FoodPassApp;
