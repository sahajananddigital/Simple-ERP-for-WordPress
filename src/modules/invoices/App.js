/**
 * Invoices Module App
 */
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	Card,
	CardBody,
	CardHeader,
	Button,
	TextControl,
	TextareaControl,
	Spinner,
	Notice,
	Flex,
	FlexBlock,
	TabPanel,
} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

const InvoicesApp = ( { view = 'list' } ) => {
	const [ invoices, setInvoices ] = useState( [] );

	const [ loading, setLoading ] = useState( true );
	const [ error, setError ] = useState( null );
	const [ isCreating, setIsCreating ] = useState( false );
	const [ formData, setFormData ] = useState( {
		contact_id: '',
		invoice_date: new Date().toISOString().split( 'T' )[ 0 ],
		due_date: '',
		subtotal: '',
		tax_amount: '',
		total_amount: '',
		notes: '',
		status: 'draft',
	} );

	const [ activeTab, setActiveTab ] = useState(
		view === 'create' ? 'create' : 'list'
	);

	useEffect( () => {
		if ( activeTab === 'list' ) {
			fetchInvoices();
		}
	}, [ activeTab ] );

	const fetchInvoices = async () => {
		setLoading( true );
		setError( null );
		try {
			const data = await apiFetch( { path: '/wp-erp/v1/invoices' } );
			setInvoices( data );
		} catch ( err ) {
			setError(
				err.message || __( 'Failed to fetch invoices', 'wp-erp' )
			);
		} finally {
			setLoading( false );
		}
	};

	const handleSubmit = async ( e ) => {
		e.preventDefault();
		setIsCreating( true );
		setError( null );

		try {
			await apiFetch( {
				path: '/wp-erp/v1/invoices',
				method: 'POST',
				data: formData,
			} );
			if ( activeTab === 'create' ) {
				setActiveTab( 'list' );
			} else {
				fetchInvoices();
			}
		} catch ( err ) {
			setError(
				err.message || __( 'Failed to create invoice', 'wp-erp' )
			);
		} finally {
			setIsCreating( false );
		}
	};

	const getStatusColor = ( status ) => {
		switch ( status ) {
			case 'paid':
				return '#00a32a';
			case 'draft':
				return '#757575';
			default:
				return '#dba617';
		}
	};

	const renderInvoicesList = () => {
		if ( loading ) {
			return (
				<Flex justify="center" style={ { padding: '32px' } }>
					<Spinner />
				</Flex>
			);
		}

		if ( invoices.length === 0 ) {
			return (
				<p
					style={ {
						padding: '16px',
						textAlign: 'center',
						color: '#757575',
					} }
				>
					{ __( 'No invoices found.', 'wp-erp' ) }
				</p>
			);
		}

		return (
			<div style={ { overflowX: 'auto' } }>
				<table className="wp-list-table widefat fixed striped">
					<thead>
						<tr>
							<th>{ __( 'Invoice No', 'wp-erp' ) }</th>
							<th>{ __( 'Date', 'wp-erp' ) }</th>
							<th>{ __( 'Due Date', 'wp-erp' ) }</th>
							<th>{ __( 'Total Amount', 'wp-erp' ) }</th>
							<th>{ __( 'Status', 'wp-erp' ) }</th>
						</tr>
					</thead>
					<tbody>
						{ invoices.map( ( invoice ) => (
							<tr key={ invoice.id }>
								<td>
									<strong>{ invoice.invoice_no }</strong>
								</td>
								<td>{ invoice.invoice_date }</td>
								<td>{ invoice.due_date || '-' }</td>
								<td>
									<strong>{ invoice.total_amount }</strong>
								</td>
								<td>
									<span
										style={ {
											padding: '4px 8px',
											borderRadius: '2px',
											backgroundColor: getStatusColor(
												invoice.status
											),
											color: '#fff',
											fontSize: '12px',
											textTransform: 'capitalize',
										} }
									>
										{ invoice.status }
									</span>
								</td>
							</tr>
						) ) }
					</tbody>
				</table>
			</div>
		);
	};

	const renderCreateInvoice = () => {
		return (
			<Card style={ { marginBottom: '24px' } }>
				<CardHeader>
					<h2 style={ { margin: 0 } }>
						{ __( 'Create Invoice', 'wp-erp' ) }
					</h2>
				</CardHeader>
				<CardBody>
					<form onSubmit={ handleSubmit }>
						<Flex direction="column" gap={ 4 }>
							<Flex>
								<FlexBlock>
									<TextControl
										label={ __( 'Invoice Date', 'wp-erp' ) }
										type="date"
										value={ formData.invoice_date }
										onChange={ ( value ) =>
											setFormData( {
												...formData,
												invoice_date: value,
											} )
										}
										required
									/>
								</FlexBlock>
								<FlexBlock>
									<TextControl
										label={ __( 'Due Date', 'wp-erp' ) }
										type="date"
										value={ formData.due_date }
										onChange={ ( value ) =>
											setFormData( {
												...formData,
												due_date: value,
											} )
										}
									/>
								</FlexBlock>
							</Flex>
							<FlexBlock>
								<TextControl
									label={ __( 'Subtotal', 'wp-erp' ) }
									type="number"
									step="0.01"
									value={ formData.subtotal }
									onChange={ ( value ) => {
										const subtotal =
											parseFloat( value ) || 0;
										const tax =
											parseFloat( formData.tax_amount ) ||
											0;
										setFormData( {
											...formData,
											subtotal: value,
											total_amount: (
												subtotal + tax
											).toFixed( 2 ),
										} );
									} }
								/>
							</FlexBlock>
							<FlexBlock>
								<TextControl
									label={ __( 'Tax Amount', 'wp-erp' ) }
									type="number"
									step="0.01"
									value={ formData.tax_amount }
									onChange={ ( value ) => {
										const subtotal =
											parseFloat( formData.subtotal ) ||
											0;
										const tax = parseFloat( value ) || 0;
										setFormData( {
											...formData,
											tax_amount: value,
											total_amount: (
												subtotal + tax
											).toFixed( 2 ),
										} );
									} }
								/>
							</FlexBlock>
							<FlexBlock>
								<TextControl
									label={ __( 'Total Amount', 'wp-erp' ) }
									type="number"
									step="0.01"
									value={ formData.total_amount }
									readOnly
								/>
							</FlexBlock>
							<FlexBlock>
								<TextareaControl
									label={ __( 'Notes', 'wp-erp' ) }
									value={ formData.notes }
									onChange={ ( value ) =>
										setFormData( {
											...formData,
											notes: value,
										} )
									}
									rows={ 4 }
								/>
							</FlexBlock>
							<Flex justify="flex-start">
								<Button
									variant="primary"
									type="submit"
									isBusy={ isCreating }
								>
									{ __( 'Create Invoice', 'wp-erp' ) }
								</Button>
							</Flex>
						</Flex>
					</form>
				</CardBody>
			</Card>
		);
	};

	return (
		<div className="wp-erp-invoices" style={ { padding: '16px' } }>
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
						{ __( 'Invoice Management', 'wp-erp' ) }
					</h2>
				</CardHeader>
				<CardBody>
					<TabPanel
						className="wp-erp-invoices-tabs"
						activeClass="is-active"
						initialTabName={ activeTab }
						onSelect={ ( tabName ) => setActiveTab( tabName ) }
						tabs={ [
							{
								name: 'list',
								title: __( 'All Invoices', 'wp-erp' ),
								className: 'tab-list',
							},
							{
								name: 'create',
								title: __( 'Create Invoice', 'wp-erp' ),
								className: 'tab-create',
							},
						] }
					>
						{ ( tab ) => {
							if ( tab.name === 'list' ) {
								return renderInvoicesList();
							}
							return renderCreateInvoice();
						} }
					</TabPanel>
				</CardBody>
			</Card>
		</div>
	);
};

export default InvoicesApp;
