/**
 * Expenses Module App
 */
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	Card,
	CardBody,
	CardHeader,
	Button,
	TextControl,
	SelectControl,
	TextareaControl,
	Spinner,
	Notice,
	Flex,
	FlexBlock,
} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

const ExpensesApp = ({ view = 'list' }) => {
	const [expenses, setExpenses] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isCreating, setIsCreating] = useState(false);
	const [formData, setFormData] = useState({
		expense_type: 'general',
		date: new Date().toISOString().split('T')[0],
		amount: '',
		description: '',
		category: '',
		payment_method: 'cash',
		status: 'pending',
	});

	useEffect(() => {
		if (view === 'list') {
			fetchExpenses();
		}
	}, [view]);

	const fetchExpenses = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await apiFetch({ path: '/wp-erp/v1/expenses' });
			setExpenses(data);
		} catch (err) {
			setError(err.message || __('Failed to fetch expenses', 'wp-erp'));
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsCreating(true);
		setError(null);

		try {
			await apiFetch({
				path: '/wp-erp/v1/expenses',
				method: 'POST',
				data: formData,
			});
			setFormData({
				expense_type: 'general',
				date: new Date().toISOString().split('T')[0],
				amount: '',
				description: '',
				category: '',
				payment_method: 'cash',
				status: 'pending',
			});
			if (view === 'create') {
				window.location.href = 'admin.php?page=wp-erp-expenses';
			} else {
				fetchExpenses();
			}
		} catch (err) {
			setError(err.message || __('Failed to create expense', 'wp-erp'));
		} finally {
			setIsCreating(false);
		}
	};

	if (view === 'create') {
		return (
			<div className="wp-erp-expenses" style={{ padding: '16px' }}>
				{error && (
					<Notice status="error" isDismissible={false} onRemove={() => setError(null)}>
						{error}
					</Notice>
				)}

				<Card>
					<CardHeader>
						<h2 style={{ margin: 0 }}>{__('Add Expense', 'wp-erp')}</h2>
					</CardHeader>
					<CardBody>
						<form onSubmit={handleSubmit}>
							<Flex direction="column" gap={4}>
								<Flex>
									<FlexBlock>
										<SelectControl
											label={__('Expense Type', 'wp-erp')}
											value={formData.expense_type}
											options={[
												{ label: __('General', 'wp-erp'), value: 'general' },
												{ label: __('Travel', 'wp-erp'), value: 'travel' },
												{ label: __('Meals', 'wp-erp'), value: 'meals' },
												{ label: __('Office Supplies', 'wp-erp'), value: 'office_supplies' },
											]}
											onChange={(value) => setFormData({ ...formData, expense_type: value })}
										/>
									</FlexBlock>
									<FlexBlock>
										<TextControl
											label={__('Date', 'wp-erp')}
											type="date"
											value={formData.date}
											onChange={(value) => setFormData({ ...formData, date: value })}
											required
										/>
									</FlexBlock>
								</Flex>
								<Flex>
									<FlexBlock>
										<TextControl
											label={__('Amount', 'wp-erp')}
											type="number"
											step="0.01"
											value={formData.amount}
											onChange={(value) => setFormData({ ...formData, amount: value })}
											required
										/>
									</FlexBlock>
									<FlexBlock>
										<TextControl
											label={__('Category', 'wp-erp')}
											value={formData.category}
											onChange={(value) => setFormData({ ...formData, category: value })}
										/>
									</FlexBlock>
								</Flex>
								<Flex>
									<FlexBlock>
										<SelectControl
											label={__('Payment Method', 'wp-erp')}
											value={formData.payment_method}
											options={[
												{ label: __('Cash', 'wp-erp'), value: 'cash' },
												{ label: __('Bank Transfer', 'wp-erp'), value: 'bank_transfer' },
												{ label: __('Credit Card', 'wp-erp'), value: 'credit_card' },
												{ label: __('Cheque', 'wp-erp'), value: 'cheque' },
											]}
											onChange={(value) => setFormData({ ...formData, payment_method: value })}
										/>
									</FlexBlock>
									<FlexBlock>
										<SelectControl
											label={__('Status', 'wp-erp')}
											value={formData.status}
											options={[
												{ label: __('Pending', 'wp-erp'), value: 'pending' },
												{ label: __('Approved', 'wp-erp'), value: 'approved' },
												{ label: __('Rejected', 'wp-erp'), value: 'rejected' },
											]}
											onChange={(value) => setFormData({ ...formData, status: value })}
										/>
									</FlexBlock>
								</Flex>
								<FlexBlock>
									<TextareaControl
										label={__('Description', 'wp-erp')}
										value={formData.description}
										onChange={(value) => setFormData({ ...formData, description: value })}
										rows={4}
									/>
								</FlexBlock>
								<Flex justify="flex-start">
									<Button variant="primary" type="submit" isBusy={isCreating}>
										{__('Add Expense', 'wp-erp')}
									</Button>
								</Flex>
							</Flex>
						</form>
					</CardBody>
				</Card>
			</div>
		);
	}

	return (
		<div className="wp-erp-expenses" style={{ padding: '16px' }}>
			{error && (
				<Notice status="error" isDismissible={false} onRemove={() => setError(null)}>
					{error}
				</Notice>
			)}

			<Card>
				<CardHeader>
					<Flex justify="space-between" align="center">
						<h2 style={{ margin: 0 }}>{__('Expenses', 'wp-erp')}</h2>
						<Button variant="primary" href="admin.php?page=wp-erp-expenses-create">
							{__('Add Expense', 'wp-erp')}
						</Button>
					</Flex>
				</CardHeader>
				<CardBody>
					{loading ? (
						<Flex justify="center" style={{ padding: '32px' }}>
							<Spinner />
						</Flex>
					) : expenses.length === 0 ? (
						<p style={{ padding: '16px', textAlign: 'center', color: '#757575' }}>
							{__('No expenses found.', 'wp-erp')}
						</p>
					) : (
						<div style={{ overflowX: 'auto' }}>
							<table className="wp-list-table widefat fixed striped">
								<thead>
									<tr>
										<th>{__('Expense No', 'wp-erp')}</th>
										<th>{__('Type', 'wp-erp')}</th>
										<th>{__('Date', 'wp-erp')}</th>
										<th>{__('Amount', 'wp-erp')}</th>
										<th>{__('Category', 'wp-erp')}</th>
										<th>{__('Status', 'wp-erp')}</th>
									</tr>
								</thead>
								<tbody>
									{expenses.map((expense) => (
										<tr key={expense.id}>
											<td><strong>{expense.expense_no}</strong></td>
											<td>{expense.expense_type}</td>
											<td>{expense.date}</td>
											<td><strong>{expense.amount}</strong></td>
											<td>{expense.category || '-'}</td>
											<td>
												<span style={{
													padding: '4px 8px',
													borderRadius: '2px',
													backgroundColor: expense.status === 'approved' ? '#00a32a' : expense.status === 'rejected' ? '#d63638' : '#dba617',
													color: '#fff',
													fontSize: '12px',
													textTransform: 'capitalize'
												}}>
													{expense.status}
												</span>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</CardBody>
			</Card>
		</div>
	);
};

export default ExpensesApp;

