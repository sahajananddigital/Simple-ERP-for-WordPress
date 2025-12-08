/**
 * Accounting Module App
 */
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	Card,
	CardBody,
	CardHeader,
	Spinner,
	Notice,
	Flex,
	TabPanel,
	Modal,
	Button,
	TextControl,
	SelectControl,
	TextareaControl,
	FlexBlock,
} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

const AccountingApp = ( { view = 'accounts' } ) => {
	const [ accounts, setAccounts ] = useState( [] );
	const [ transactions, setTransactions ] = useState( [] );
	const [ loading, setLoading ] = useState( true );
	const [ error, setError ] = useState( null );
	const [ selectedTransaction, setSelectedTransaction ] = useState( null );
	const [ activeTab, setActiveTab ] = useState(
		view === 'transactions' ? 'transactions' : 'accounts'
	);
	const [ isCreating, setIsCreating ] = useState( false );
	const [ formData, setFormData ] = useState( {
		voucher_no: '',
		type: 'payment',
		date: new Date().toISOString().split( 'T' )[ 0 ],
		reference: '',
		total: '',
		description: '',
	} );

	useEffect( () => {
		if ( activeTab === 'accounts' ) {
			fetchAccounts();
		} else {
			fetchTransactions();
		}
	}, [ activeTab ] );

	const fetchAccounts = async () => {
		setLoading( true );
		setError( null );
		try {
			const data = await apiFetch( {
				path: '/wp-erp/v1/accounting/accounts',
			} );
			setAccounts( data );
		} catch ( err ) {
			setError(
				err.message || __( 'Failed to fetch accounts', 'wp-erp' )
			);
		} finally {
			setLoading( false );
		}
	};

	const fetchTransactions = async () => {
		setLoading( true );
		setError( null );
		try {
			const data = await apiFetch( {
				path: '/wp-erp/v1/accounting/transactions',
			} );
			setTransactions( data );
		} catch ( err ) {
			setError(
				err.message || __( 'Failed to fetch transactions', 'wp-erp' )
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
				path: '/wp-erp/v1/accounting/transactions',
				method: 'POST',
				data: formData,
			} );
			setFormData( {
				voucher_no: '',
				type: 'payment',
				date: new Date().toISOString().split( 'T' )[ 0 ],
				reference: '',
				total: '',
				description: '',
			} );
			if ( activeTab === 'create' ) {
				setActiveTab( 'transactions' );
			} else {
				fetchTransactions();
			}
		} catch ( err ) {
			setError(
				err.message || __( 'Failed to create transaction', 'wp-erp' )
			);
		} finally {
			setIsCreating( false );
		}
	};

	const renderTransactions = () => {
		if ( loading ) {
			return (
				<Flex justify="center" style={ { padding: '32px' } }>
					<Spinner />
				</Flex>
			);
		}

		if ( transactions.length === 0 ) {
			return (
				<p
					style={ {
						padding: '16px',
						textAlign: 'center',
						color: '#757575',
					} }
				>
					{ __( 'No transactions found.', 'wp-erp' ) }
				</p>
			);
		}

		return (
			<div style={ { overflowX: 'auto' } }>
				<table className="wp-list-table widefat fixed striped">
					<thead>
						<tr>
							<th>{ __( 'Voucher No', 'wp-erp' ) }</th>
							<th>{ __( 'Type', 'wp-erp' ) }</th>
							<th>{ __( 'Date', 'wp-erp' ) }</th>
							<th>{ __( 'Reference', 'wp-erp' ) }</th>
							<th>{ __( 'Total', 'wp-erp' ) }</th>
							<th>{ __( 'Actions', 'wp-erp' ) }</th>
						</tr>
					</thead>
					<tbody>
						{ transactions.map( ( transaction ) => (
							<tr key={ transaction.id }>
								<td>
									<strong>{ transaction.voucher_no }</strong>
								</td>
								<td>{ transaction.type }</td>
								<td>{ transaction.date }</td>
								<td>{ transaction.reference || '-' }</td>
								<td>
									<strong>{ transaction.total }</strong>
								</td>
								<td>
									<Button
										variant="secondary"
										onClick={ () =>
											setSelectedTransaction(
												transaction
											)
										}
										isSmall
									>
										{ __( 'View', 'wp-erp' ) }
									</Button>
								</td>
							</tr>
						) ) }
					</tbody>
				</table>
			</div>
		);
	};

	const renderAccounts = () => {
		if ( loading ) {
			return (
				<Flex justify="center" style={ { padding: '32px' } }>
					<Spinner />
				</Flex>
			);
		}

		if ( accounts.length === 0 ) {
			return (
				<p
					style={ {
						padding: '16px',
						textAlign: 'center',
						color: '#757575',
					} }
				>
					{ __( 'No accounts found.', 'wp-erp' ) }
				</p>
			);
		}

		return (
			<div style={ { overflowX: 'auto' } }>
				<table className="wp-list-table widefat fixed striped">
					<thead>
						<tr>
							<th>{ __( 'Code', 'wp-erp' ) }</th>
							<th>{ __( 'Name', 'wp-erp' ) }</th>
							<th>{ __( 'Type', 'wp-erp' ) }</th>
							<th>{ __( 'Balance', 'wp-erp' ) }</th>
						</tr>
					</thead>
					<tbody>
						{ accounts.map( ( account ) => (
							<tr key={ account.id }>
								<td>
									<strong>{ account.code }</strong>
								</td>
								<td>{ account.name }</td>
								<td>{ account.type }</td>
								<td>
									<strong>{ account.balance }</strong>
								</td>
							</tr>
						) ) }
					</tbody>
				</table>
			</div>
		);
	};

	const renderCreateTransaction = () => {
		return (
			<Card style={ { marginBottom: '24px' } }>
				<CardHeader>
					<h2 style={ { margin: 0 } }>
						{ __( 'Create Transaction', 'wp-erp' ) }
					</h2>
				</CardHeader>
				<CardBody>
					<form onSubmit={ handleSubmit }>
						<Flex direction="column" gap={ 4 }>
							<Flex>
								<FlexBlock>
									<TextControl
										label={ __( 'Voucher No', 'wp-erp' ) }
										value={ formData.voucher_no }
										onChange={ ( value ) =>
											setFormData( {
												...formData,
												voucher_no: value,
											} )
										}
										required
									/>
								</FlexBlock>
								<FlexBlock>
									<SelectControl
										label={ __( 'Type', 'wp-erp' ) }
										value={ formData.type }
										options={ [
											{
												label: __(
													'Payment',
													'wp-erp'
												),
												value: 'payment',
											},
											{
												label: __(
													'Receipt',
													'wp-erp'
												),
												value: 'receipt',
											},
											{
												label: __(
													'Journal',
													'wp-erp'
												),
												value: 'journal',
											},
										] }
										onChange={ ( value ) =>
											setFormData( {
												...formData,
												type: value,
											} )
										}
									/>
								</FlexBlock>
								<FlexBlock>
									<TextControl
										label={ __( 'Date', 'wp-erp' ) }
										type="date"
										value={ formData.date }
										onChange={ ( value ) =>
											setFormData( {
												...formData,
												date: value,
											} )
										}
										required
									/>
								</FlexBlock>
							</Flex>
							<Flex>
								<FlexBlock>
									<TextControl
										label={ __( 'Reference', 'wp-erp' ) }
										value={ formData.reference }
										onChange={ ( value ) =>
											setFormData( {
												...formData,
												reference: value,
											} )
										}
									/>
								</FlexBlock>
								<FlexBlock>
									<TextControl
										label={ __( 'Total', 'wp-erp' ) }
										type="number"
										step="0.01"
										value={ formData.total }
										onChange={ ( value ) =>
											setFormData( {
												...formData,
												total: value,
											} )
										}
										required
									/>
								</FlexBlock>
							</Flex>
							<FlexBlock>
								<TextareaControl
									label={ __( 'Description', 'wp-erp' ) }
									value={ formData.description }
									onChange={ ( value ) =>
										setFormData( {
											...formData,
											description: value,
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
									{ __( 'Create Transaction', 'wp-erp' ) }
								</Button>
							</Flex>
						</Flex>
					</form>
				</CardBody>
			</Card>
		);
	};

	return (
		<div className="wp-erp-accounting" style={ { padding: '16px' } }>
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
						{ __( 'Accounting', 'wp-erp' ) }
					</h2>
				</CardHeader>
				<CardBody>
					<TabPanel
						className="wp-erp-accounting-tabs"
						activeClass="is-active"
						initialTabName={ activeTab }
						onSelect={ ( tabName ) => setActiveTab( tabName ) }
						tabs={ [
							{
								name: 'accounts',
								title: __( 'Chart of Accounts', 'wp-erp' ),
								className: 'tab-accounts',
							},
							{
								name: 'transactions',
								title: __( 'Transactions', 'wp-erp' ),
								className: 'tab-transactions',
							},
							{
								name: 'create',
								title: __( 'Create Transaction', 'wp-erp' ),
								className: 'tab-create',
							},
						] }
					>
						{ ( tab ) => {
							if ( tab.name === 'accounts' ) {
								return renderAccounts();
							} else if ( tab.name === 'transactions' ) {
								return renderTransactions();
							}
							return renderCreateTransaction();
						} }
					</TabPanel>
				</CardBody>
			</Card>

			{ selectedTransaction && (
				<Modal
					title={ __( 'Transaction Details', 'wp-erp' ) }
					onRequestClose={ () => setSelectedTransaction( null ) }
				>
					<div style={ { padding: '16px' } }>
						<p>
							<strong>{ __( 'Voucher No:', 'wp-erp' ) }</strong>{ ' ' }
							{ selectedTransaction.voucher_no }
						</p>
						<p>
							<strong>{ __( 'Type:', 'wp-erp' ) }</strong>{ ' ' }
							{ selectedTransaction.type }
						</p>
						<p>
							<strong>{ __( 'Date:', 'wp-erp' ) }</strong>{ ' ' }
							{ selectedTransaction.date }
						</p>
						<p>
							<strong>{ __( 'Reference:', 'wp-erp' ) }</strong>{ ' ' }
							{ selectedTransaction.reference || '-' }
						</p>
						<p>
							<strong>{ __( 'Total:', 'wp-erp' ) }</strong>{ ' ' }
							{ selectedTransaction.total }
						</p>
						<Flex
							justify="flex-end"
							style={ { marginTop: '24px' } }
						>
							<Button
								variant="primary"
								onClick={ () => setSelectedTransaction( null ) }
							>
								{ __( 'Close', 'wp-erp' ) }
							</Button>
						</Flex>
					</div>
				</Modal>
			) }
		</div>
	);
};

export default AccountingApp;
