/**
 * Transactions List Component
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Flex, Spinner, Button, Modal } from '@wordpress/components';

const TransactionsList = ( { transactions, loading } ) => {
	const [ selectedTransaction, setSelectedTransaction ] = useState( null );

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
		<>
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
		</>
	);
};

export default TransactionsList;
