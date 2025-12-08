/**
 * Donations Module App
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
	SelectControl,
} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

const DonationsApp = () => {
	const [ donations, setDonations ] = useState( [] );
	const [ loading, setLoading ] = useState( true );
	const [ error, setError ] = useState( null );
	const [ isCreating, setIsCreating ] = useState( false );
	const [ activeTab, setActiveTab ] = useState( 'create' );

	// Form State
	const [ donorName, setDonorName ] = useState( '' );
	const [ phone, setPhone ] = useState( '' );
	const [ ledger, setLedger ] = useState( '' );
	const [ amount, setAmount ] = useState( '' );
	const [ note, setNote ] = useState( '' );

	// Ledger State
	const [ ledgers, setLedgers ] = useState( [] );
	const [ newLedger, setNewLedger ] = useState( '' );

	// Print State
	const [ showReceipt, setShowReceipt ] = useState( false );
	const [ lastPrintedDonation, setLastPrintedDonation ] = useState( null );
	const receiptRef = useRef( null );

	// Fetch Ledgers on Mount
	useEffect( () => {
		fetchLedgers();
	}, [] );

	const fetchLedgers = async () => {
		try {
			const data = await apiFetch( {
				path: '/wp-erp/v1/donations/ledgers',
			} );
			setLedgers( data );
			if ( data.length > 0 && ! ledger ) {
				setLedger( data[ 0 ] );
			}
		} catch ( err ) {
			console.error( err );
		}
	};

	const fetchDonations = async () => {
		setLoading( true );
		try {
			const data = await apiFetch( { path: '/wp-erp/v1/donations' } );
			setDonations( data );
		} catch ( err ) {
			setError( err.message );
		} finally {
			setLoading( false );
		}
	};

	const handlePhoneBlur = async () => {
		if ( ! phone ) return;
		try {
			const data = await apiFetch( {
				path: `/wp-erp/v1/donations/donor?phone=${ phone }`,
			} );
			if ( data.found && data.donor_name ) {
				setDonorName( data.donor_name );
			}
		} catch ( err ) {
			console.log( 'Donor lookup failed', err );
		}
	};

	const handleSave = async ( e ) => {
		e.preventDefault();
		setIsCreating( true );
		setError( null );

		const today = new Date().toISOString().split( 'T' )[ 0 ];

		const payload = {
			donor_name: donorName,
			phone,
			ledger,
			amount,
			notes: note,
			issue_date: today,
		};

		// Optimistic UI for print
		const printData = { ...payload, id: 'PENDING...', date: today };
		setLastPrintedDonation( printData );
		setShowReceipt( true );

		setTimeout( () => window.print(), 500 );

		try {
			const saved = await apiFetch( {
				path: '/wp-erp/v1/donations',
				method: 'POST',
				data: payload,
			} );

			setLastPrintedDonation( ( prev ) => ( { ...prev, id: saved.id } ) );

			// Update list state
			setDonations( [ saved, ...donations ] );

			// Reset
			setDonorName( '' );
			setPhone( '' );
			setAmount( '' );
			setNote( '' );
		} catch ( err ) {
			setError(
				err.message || __( 'Failed to save donation', 'wp-erp' )
			);
		} finally {
			setIsCreating( false );
		}
	};

	const addLedger = async () => {
		if ( ! newLedger ) return;
		const updated = [ ...ledgers, newLedger ];
		setLedgers( updated );
		setNewLedger( '' );
		try {
			await apiFetch( {
				path: '/wp-erp/v1/donations/ledgers',
				method: 'POST',
				data: { ledgers: updated },
			} );
		} catch ( err ) {
			setError( 'Failed to save ledger' );
		}
	};

	const renderCreate = () => (
		<Card>
			<CardHeader>
				<h3>{ __( 'New Donation', 'wp-erp' ) }</h3>
			</CardHeader>
			<CardBody>
				<form onSubmit={ handleSave }>
					<Flex direction="column" gap={ 4 }>
						<TextControl
							label={ __( 'Date', 'wp-erp' ) }
							value={ new Date().toLocaleDateString() }
							readOnly
						/>
						<TextControl
							label={ __( 'Phone Number', 'wp-erp' ) }
							value={ phone }
							onChange={ setPhone }
							onBlur={ handlePhoneBlur }
							required
						/>
						<TextControl
							label={ __( 'Donor Name', 'wp-erp' ) }
							value={ donorName }
							onChange={ setDonorName }
							required
						/>
						<SelectControl
							label={ __( 'Ledger', 'wp-erp' ) }
							value={ ledger }
							options={ ledgers.map( ( l ) => ( {
								label: l,
								value: l,
							} ) ) }
							onChange={ setLedger }
						/>
						<TextControl
							label={ __( 'Note (Optional)', 'wp-erp' ) }
							value={ note }
							onChange={ setNote }
						/>

						<div>
							<label className="components-base-control__label">
								{ __( 'Amount', 'wp-erp' ) }
							</label>
							<Flex
								gap={ 2 }
								wrap={ true }
								style={ { marginBottom: '10px' } }
							>
								{ [ 100, 200, 250, 500, 1000 ].map( ( amt ) => (
									<Button
										key={ amt }
										variant={
											parseInt( amount ) === amt
												? 'primary'
												: 'secondary'
										}
										onClick={ () => setAmount( amt ) }
									>
										₹{ amt }
									</Button>
								) ) }
							</Flex>
							<TextControl
								placeholder={ __( 'Custom Amount', 'wp-erp' ) }
								type="number"
								value={ amount }
								onChange={ setAmount }
								required
							/>
						</div>

						<div style={ { fontSize: '18px', fontWeight: 'bold' } }>
							Total: ₹{ amount || 0 }
						</div>

						<Button
							type="submit"
							variant="primary"
							isBusy={ isCreating }
						>
							{ __( 'Print & Save', 'wp-erp' ) }
						</Button>
					</Flex>
				</form>
			</CardBody>
		</Card>
	);

	return (
		<div className="wp-erp-donations" style={ { padding: '20px' } }>
			{ error && (
				<Notice status="error" onRemove={ () => setError( null ) }>
					{ error }
				</Notice>
			) }

			{ /* Print Receipt (Hidden) */ }
			{ showReceipt && lastPrintedDonation && (
				<div className="donation-receipt" style={ { display: 'none' } }>
					<style>{ `
						@media print {
							body * { visibility: hidden; }
							.donation-receipt, .donation-receipt * { visibility: visible; }
							.donation-receipt { 
								display: block !important; 
								position: absolute; 
								top: 0; 
								left: 0; 
								width: 100%;
								font-family: monospace;
								padding: 20px;
							}
						}
					` }</style>
					<h2 style={ { textAlign: 'center' } }>Donation Receipt</h2>
					<p>
						<strong>ID:</strong> { lastPrintedDonation.id }
					</p>
					<p>
						<strong>Date:</strong> { lastPrintedDonation.date }
					</p>
					<p>
						<strong>Donor:</strong>{ ' ' }
						{ lastPrintedDonation.donor_name }
					</p>
					<p>
						<strong>Phone:</strong> { lastPrintedDonation.phone }
					</p>
					<p>
						<strong>Ledger:</strong> { lastPrintedDonation.ledger }
					</p>
					<p>
						<strong>Amount:</strong> ₹{ lastPrintedDonation.amount }
					</p>
					<p style={ { textAlign: 'center', marginTop: '20px' } }>
						Thank you!
					</p>
				</div>
			) }

			<TabPanel
				className="wp-erp-donations-tabs"
				activeClass="is-active"
				onSelect={ setActiveTab }
				tabs={ [
					{
						name: 'create',
						title: 'Create Donation',
						className: 'tab-create',
					},
					{
						name: 'history',
						title: 'History',
						className: 'tab-history',
					},
					{
						name: 'settings',
						title: 'Settings',
						className: 'tab-settings',
					},
				] }
			>
				{ ( tab ) => {
					if ( tab.name === 'create' ) return renderCreate();
					if ( tab.name === 'history' ) {
						if ( loading && donations.length === 0 )
							fetchDonations(); // Lazy fetch

						return (
							<Card>
								<CardHeader>
									<h3>{ __( 'Donation History' ) }</h3>
								</CardHeader>
								<CardBody>
									{ donations.length === 0 ? (
										<p
											style={ {
												textAlign: 'center',
												color: '#757575',
											} }
										>
											{ __( 'No donations found.' ) }
										</p>
									) : (
										<table className="wp-list-table widefat fixed striped">
											<thead>
												<tr>
													<th>{ __( 'ID' ) }</th>
													<th>{ __( 'Date' ) }</th>
													<th>{ __( 'Donor' ) }</th>
													<th>{ __( 'Phone' ) }</th>
													<th>{ __( 'Ledger' ) }</th>
													<th>{ __( 'Amount' ) }</th>
												</tr>
											</thead>
											<tbody>
												{ donations.map( ( d ) => (
													<tr key={ d.id }>
														<td>{ d.id }</td>
														<td>
															{ d.issue_date }
														</td>
														<td>
															{ d.donor_name }
														</td>
														<td>{ d.phone }</td>
														<td>{ d.ledger }</td>
														<td>₹{ d.amount }</td>
													</tr>
												) ) }
											</tbody>
										</table>
									) }
								</CardBody>
							</Card>
						);
					}
					if ( tab.name === 'settings' ) {
						return (
							<Card>
								<CardHeader>
									<h3>Manage Ledgers</h3>
								</CardHeader>
								<CardBody>
									<ul>
										{ ledgers.map( ( l, i ) => (
											<li key={ i }>{ l }</li>
										) ) }
									</ul>
									<Flex>
										<TextControl
											value={ newLedger }
											onChange={ setNewLedger }
											placeholder="New Ledger Name"
										/>
										<Button
											variant="secondary"
											onClick={ addLedger }
										>
											Add
										</Button>
									</Flex>
								</CardBody>
							</Card>
						);
					}
				} }
			</TabPanel>
		</div>
	);
};

export default DonationsApp;
