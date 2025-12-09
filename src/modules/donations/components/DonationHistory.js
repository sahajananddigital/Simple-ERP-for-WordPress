/**
 * Donation History Component
 */
import { __ } from '@wordpress/i18n';
import { Card, CardBody, CardHeader, Spinner, Flex } from '@wordpress/components';

const DonationHistory = ( { donations, loading } ) => {
	if ( loading && donations.length === 0 ) {
		return (
			<Flex justify="center" style={ { padding: '32px' } }>
				<Spinner />
			</Flex>
		);
	}

	return (
		<Card>
			<CardHeader>
				<h3>{ __( 'Donation History', 'wp-erp' ) }</h3>
			</CardHeader>
			<CardBody>
				{ donations.length === 0 ? (
					<p
						style={ {
							textAlign: 'center',
							color: '#757575',
						} }
					>
						{ __( 'No donations found.', 'wp-erp' ) }
					</p>
				) : (
					<table className="wp-list-table widefat fixed striped">
						<thead>
							<tr>
								<th>{ __( 'ID', 'wp-erp' ) }</th>
								<th>{ __( 'Date', 'wp-erp' ) }</th>
								<th>{ __( 'Donor', 'wp-erp' ) }</th>
								<th>{ __( 'Phone', 'wp-erp' ) }</th>
								<th>{ __( 'Ledger', 'wp-erp' ) }</th>
								<th>{ __( 'Amount', 'wp-erp' ) }</th>
							</tr>
						</thead>
						<tbody>
							{ donations.map( ( d ) => (
								<tr key={ d.id }>
									<td>{ d.id }</td>
									<td>{ d.issue_date }</td>
									<td>{ d.donor_name }</td>
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
};

export default DonationHistory;
