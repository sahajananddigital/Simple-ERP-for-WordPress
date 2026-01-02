/**
 * Expenses List Component
 */
import { __ } from '@wordpress/i18n';
import { Flex, Spinner } from '@wordpress/components';
import { getStatusColor } from '../utils';

const ExpensesList = ( { expenses, loading } ) => {
	if ( loading ) {
		return (
			<Flex justify="center" style={ { padding: '32px' } }>
				<Spinner />
			</Flex>
		);
	}

	if ( expenses.length === 0 ) {
		return (
			<p
				style={ {
					padding: '16px',
					textAlign: 'center',
					color: '#757575',
				} }
			>
				{ __( 'No expenses found.', 'wp-erp' ) }
			</p>
		);
	}

	return (
		<div style={ { overflowX: 'auto' } }>
			<table className="wp-list-table widefat fixed striped">
				<thead>
					<tr>
						<th>{ __( 'Expense No', 'wp-erp' ) }</th>
						<th>{ __( 'Type', 'wp-erp' ) }</th>
						<th>{ __( 'Date', 'wp-erp' ) }</th>
						<th>{ __( 'Amount', 'wp-erp' ) }</th>
						<th>{ __( 'Category', 'wp-erp' ) }</th>
						<th>{ __( 'Status', 'wp-erp' ) }</th>
					</tr>
				</thead>
				<tbody>
					{ expenses.map( ( expense ) => (
						<tr key={ expense.id }>
							<td>
								<strong>{ expense.expense_no }</strong>
							</td>
							<td>{ expense.expense_type }</td>
							<td>{ expense.date }</td>
							<td>
								<strong>{ expense.amount }</strong>
							</td>
							<td>{ expense.category || '-' }</td>
							<td>
								<span
									style={ {
										padding: '4px 8px',
										borderRadius: '2px',
										backgroundColor: getStatusColor(
											expense.status
										),
										color: '#fff',
										fontSize: '12px',
										textTransform: 'capitalize',
									} }
								>
									{ expense.status }
								</span>
							</td>
						</tr>
					) ) }
				</tbody>
			</table>
		</div>
	);
};

export default ExpensesList;
