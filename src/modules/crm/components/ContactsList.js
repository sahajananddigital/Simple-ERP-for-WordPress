/**
 * Contacts List Component
 */
import { __ } from '@wordpress/i18n';
import { Flex, Spinner } from '@wordpress/components';
import { getStatusColor } from '../utils';

const ContactsList = ( { contacts, loading } ) => {
	if ( loading ) {
		return (
			<Flex justify="center" style={ { padding: '32px' } }>
				<Spinner />
			</Flex>
		);
	}

	if ( contacts.length === 0 ) {
		return (
			<p
				style={ {
					padding: '16px',
					textAlign: 'center',
					color: '#757575',
				} }
			>
				{ __( 'No contacts found.', 'wp-erp' ) }
			</p>
		);
	}

	return (
		<div style={ { overflowX: 'auto' } }>
			<table className="wp-list-table widefat fixed striped">
				<thead>
					<tr>
						<th>{ __( 'Name', 'wp-erp' ) }</th>
						<th>{ __( 'Email', 'wp-erp' ) }</th>
						<th>{ __( 'Phone', 'wp-erp' ) }</th>
						<th>{ __( 'Company', 'wp-erp' ) }</th>
						<th>{ __( 'Status', 'wp-erp' ) }</th>
					</tr>
				</thead>
				<tbody>
					{ contacts.map( ( contact ) => (
						<tr key={ contact.id }>
							<td>
								<strong>
									{ contact.first_name }{ ' ' }
									{ contact.last_name }
								</strong>
							</td>
							<td>{ contact.email || '-' }</td>
							<td>{ contact.phone || '-' }</td>
							<td>{ contact.company || '-' }</td>
							<td>
								<span
									style={ {
										padding: '4px 8px',
										borderRadius: '2px',
										backgroundColor: getStatusColor(
											contact.status
										),
										color: '#fff',
										fontSize: '12px',
										textTransform: 'capitalize',
									} }
								>
									{ contact.status }
								</span>
							</td>
						</tr>
					) ) }
				</tbody>
			</table>
		</div>
	);
};

export default ContactsList;
