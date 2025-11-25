/**
 * Food Pass Module App
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

const FoodPassApp = ({ view = 'list' }) => {
	const [foodPasses, setFoodPasses] = useState([]);
	const [employees, setEmployees] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isCreating, setIsCreating] = useState(false);
	const [formData, setFormData] = useState({
		employee_id: '',
		contact_id: '',
		issue_date: new Date().toISOString().split('T')[0],
		valid_from: new Date().toISOString().split('T')[0],
		valid_to: '',
		meals_per_day: '1',
		total_meals: '',
		status: 'active',
		notes: '',
	});

	useEffect(() => {
		if (view === 'list') {
			fetchFoodPasses();
		}
		fetchEmployees();
	}, [view]);

	const fetchFoodPasses = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await apiFetch({ path: '/wp-erp/v1/food-pass' });
			setFoodPasses(data);
		} catch (err) {
			setError(err.message || __('Failed to fetch food passes', 'wp-erp'));
		} finally {
			setLoading(false);
		}
	};

	const fetchEmployees = async () => {
		try {
			const data = await apiFetch({ path: '/wp-erp/v1/hr/employees' });
			setEmployees(data);
		} catch (err) {
			// Silently fail
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsCreating(true);
		setError(null);

		try {
			await apiFetch({
				path: '/wp-erp/v1/food-pass',
				method: 'POST',
				data: formData,
			});
			if (view === 'create') {
				window.location.href = 'admin.php?page=wp-erp-food-pass';
			} else {
				fetchFoodPasses();
			}
		} catch (err) {
			setError(err.message || __('Failed to create food pass', 'wp-erp'));
		} finally {
			setIsCreating(false);
		}
	};

	if (view === 'create') {
		return (
			<div className="wp-erp-food-pass" style={{ padding: '16px' }}>
				{error && (
					<Notice status="error" isDismissible={false} onRemove={() => setError(null)}>
						{error}
					</Notice>
				)}

				<Card>
					<CardHeader>
						<h2 style={{ margin: 0 }}>{__('Create Food Pass', 'wp-erp')}</h2>
					</CardHeader>
					<CardBody>
						<form onSubmit={handleSubmit}>
							<Flex direction="column" gap={4}>
								<Flex>
									<FlexBlock>
										<TextControl
											label={__('Issue Date', 'wp-erp')}
											type="date"
											value={formData.issue_date}
											onChange={(value) => setFormData({ ...formData, issue_date: value })}
											required
										/>
									</FlexBlock>
									<FlexBlock>
										<TextControl
											label={__('Valid From', 'wp-erp')}
											type="date"
											value={formData.valid_from}
											onChange={(value) => setFormData({ ...formData, valid_from: value })}
											required
										/>
									</FlexBlock>
									<FlexBlock>
										<TextControl
											label={__('Valid To', 'wp-erp')}
											type="date"
											value={formData.valid_to}
											onChange={(value) => setFormData({ ...formData, valid_to: value })}
											required
										/>
									</FlexBlock>
								</Flex>
								<Flex>
									<FlexBlock>
										<TextControl
											label={__('Meals Per Day', 'wp-erp')}
											type="number"
											value={formData.meals_per_day}
											onChange={(value) => setFormData({ ...formData, meals_per_day: value })}
											min="1"
										/>
									</FlexBlock>
									<FlexBlock>
										<TextControl
											label={__('Total Meals', 'wp-erp')}
											type="number"
											value={formData.total_meals}
											onChange={(value) => setFormData({ ...formData, total_meals: value })}
										/>
									</FlexBlock>
									<FlexBlock>
										<SelectControl
											label={__('Status', 'wp-erp')}
											value={formData.status}
											options={[
												{ label: __('Active', 'wp-erp'), value: 'active' },
												{ label: __('Expired', 'wp-erp'), value: 'expired' },
												{ label: __('Cancelled', 'wp-erp'), value: 'cancelled' },
											]}
											onChange={(value) => setFormData({ ...formData, status: value })}
										/>
									</FlexBlock>
								</Flex>
								<FlexBlock>
									<TextareaControl
										label={__('Notes', 'wp-erp')}
										value={formData.notes}
										onChange={(value) => setFormData({ ...formData, notes: value })}
										rows={4}
									/>
								</FlexBlock>
								<Flex justify="flex-start">
									<Button variant="primary" type="submit" isBusy={isCreating}>
										{__('Create Food Pass', 'wp-erp')}
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
		<div className="wp-erp-food-pass" style={{ padding: '16px' }}>
			{error && (
				<Notice status="error" isDismissible={false} onRemove={() => setError(null)}>
					{error}
				</Notice>
			)}

			<Card>
				<CardHeader>
					<Flex justify="space-between" align="center">
						<h2 style={{ margin: 0 }}>{__('Food Passes', 'wp-erp')}</h2>
						<Button variant="primary" href="admin.php?page=wp-erp-food-pass-create">
							{__('Create Food Pass', 'wp-erp')}
						</Button>
					</Flex>
				</CardHeader>
				<CardBody>
					{loading ? (
						<Flex justify="center" style={{ padding: '32px' }}>
							<Spinner />
						</Flex>
					) : foodPasses.length === 0 ? (
						<p style={{ padding: '16px', textAlign: 'center', color: '#757575' }}>
							{__('No food passes found.', 'wp-erp')}
						</p>
					) : (
						<div style={{ overflowX: 'auto' }}>
							<table className="wp-list-table widefat fixed striped">
								<thead>
									<tr>
										<th>{__('Pass No', 'wp-erp')}</th>
										<th>{__('Issue Date', 'wp-erp')}</th>
										<th>{__('Valid From', 'wp-erp')}</th>
										<th>{__('Valid To', 'wp-erp')}</th>
										<th>{__('Total Meals', 'wp-erp')}</th>
										<th>{__('Used Meals', 'wp-erp')}</th>
										<th>{__('Status', 'wp-erp')}</th>
									</tr>
								</thead>
								<tbody>
									{foodPasses.map((pass) => (
										<tr key={pass.id}>
											<td><strong>{pass.pass_no}</strong></td>
											<td>{pass.issue_date}</td>
											<td>{pass.valid_from}</td>
											<td>{pass.valid_to}</td>
											<td>{pass.total_meals}</td>
											<td>{pass.used_meals}</td>
											<td>
												<span style={{
													padding: '4px 8px',
													borderRadius: '2px',
													backgroundColor: pass.status === 'active' ? '#00a32a' : pass.status === 'expired' ? '#757575' : '#d63638',
													color: '#fff',
													fontSize: '12px',
													textTransform: 'capitalize'
												}}>
													{pass.status}
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

export default FoodPassApp;

