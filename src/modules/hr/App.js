/**
 * HR Module App
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
} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

const HRApp = ({ view = 'employees' }) => {
	const [employees, setEmployees] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (view === 'employees') {
			fetchEmployees();
		}
	}, [view]);

	const fetchEmployees = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await apiFetch({ path: '/wp-erp/v1/hr/employees' });
			setEmployees(data);
		} catch (err) {
			setError(err.message || __('Failed to fetch employees', 'wp-erp'));
		} finally {
			setLoading(false);
		}
	};

	if (view === 'leaves') {
		return (
			<div className="wp-erp-hr" style={{ padding: '16px' }}>
				<Card>
					<CardHeader>
						<h2 style={{ margin: 0 }}>{__('Leave Requests', 'wp-erp')}</h2>
					</CardHeader>
					<CardBody>
						<p style={{ padding: '16px', textAlign: 'center', color: '#757575' }}>
							{__('Leave management coming soon...', 'wp-erp')}
						</p>
					</CardBody>
				</Card>
			</div>
		);
	}

	return (
		<div className="wp-erp-hr" style={{ padding: '16px' }}>
			{error && (
				<Notice status="error" isDismissible={false} onRemove={() => setError(null)}>
					{error}
				</Notice>
			)}

			<Card>
				<CardHeader>
					<h2 style={{ margin: 0 }}>{__('Employees', 'wp-erp')}</h2>
				</CardHeader>
				<CardBody>
					{loading ? (
						<Flex justify="center" style={{ padding: '32px' }}>
							<Spinner />
						</Flex>
					) : employees.length === 0 ? (
						<p style={{ padding: '16px', textAlign: 'center', color: '#757575' }}>
							{__('No employees found.', 'wp-erp')}
						</p>
					) : (
						<div style={{ overflowX: 'auto' }}>
							<table className="wp-list-table widefat fixed striped">
								<thead>
									<tr>
										<th>{__('Employee ID', 'wp-erp')}</th>
										<th>{__('Name', 'wp-erp')}</th>
										<th>{__('Designation', 'wp-erp')}</th>
										<th>{__('Department', 'wp-erp')}</th>
										<th>{__('Status', 'wp-erp')}</th>
									</tr>
								</thead>
								<tbody>
									{employees.map((employee) => (
										<tr key={employee.id}>
											<td><strong>{employee.employee_id}</strong></td>
											<td>{employee.user_id ? `User #${employee.user_id}` : '-'}</td>
											<td>{employee.designation || '-'}</td>
											<td>{employee.department || '-'}</td>
											<td>
												<span style={{
													padding: '4px 8px',
													borderRadius: '2px',
													backgroundColor: employee.status === 'active' ? '#00a32a' : '#757575',
													color: '#fff',
													fontSize: '12px',
													textTransform: 'capitalize'
												}}>
													{employee.status}
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

export default HRApp;

