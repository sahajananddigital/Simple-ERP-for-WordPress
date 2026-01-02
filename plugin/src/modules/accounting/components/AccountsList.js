/**
 * Accounts List Component
 */
import { __ } from '@wordpress/i18n';
import { Flex, Spinner } from '@wordpress/components';

const AccountsList = ( { accounts, loading } ) => {
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

export default AccountsList;
