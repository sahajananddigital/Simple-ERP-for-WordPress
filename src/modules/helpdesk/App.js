/**
 * Helpdesk Module App
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
	SelectControl,
	Spinner,
	Notice,
	Flex,
	FlexBlock,
} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

const HelpdeskApp = () => {
	const [tickets, setTickets] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isCreating, setIsCreating] = useState(false);
	const [formData, setFormData] = useState({
		subject: '',
		description: '',
		priority: 'medium',
		status: 'open',
	});

	useEffect(() => {
		fetchTickets();
	}, []);

	const fetchTickets = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await apiFetch({ path: '/wp-erp/v1/helpdesk/tickets' });
			setTickets(data);
		} catch (err) {
			setError(err.message || __('Failed to fetch tickets', 'wp-erp'));
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
				path: '/wp-erp/v1/helpdesk/tickets',
				method: 'POST',
				data: formData,
			});
			setFormData({
				subject: '',
				description: '',
				priority: 'medium',
				status: 'open',
			});
			fetchTickets();
		} catch (err) {
			setError(err.message || __('Failed to create ticket', 'wp-erp'));
		} finally {
			setIsCreating(false);
		}
	};

	return (
		<div className="wp-erp-helpdesk" style={{ padding: '16px' }}>
			{error && (
				<Notice status="error" isDismissible={false} onRemove={() => setError(null)}>
					{error}
				</Notice>
			)}

			<Card style={{ marginBottom: '24px' }}>
				<CardHeader>
					<h2 style={{ margin: 0 }}>{__('Create New Ticket', 'wp-erp')}</h2>
				</CardHeader>
				<CardBody>
					<form onSubmit={handleSubmit}>
						<Flex direction="column" gap={4}>
							<FlexBlock>
								<TextControl
									label={__('Subject', 'wp-erp')}
									value={formData.subject}
									onChange={(value) => setFormData({ ...formData, subject: value })}
									required
								/>
							</FlexBlock>
							<FlexBlock>
								<TextareaControl
									label={__('Description', 'wp-erp')}
									value={formData.description}
									onChange={(value) => setFormData({ ...formData, description: value })}
									required
									rows={6}
								/>
							</FlexBlock>
							<FlexBlock>
								<SelectControl
									label={__('Priority', 'wp-erp')}
									value={formData.priority}
									options={[
										{ label: __('Low', 'wp-erp'), value: 'low' },
										{ label: __('Medium', 'wp-erp'), value: 'medium' },
										{ label: __('High', 'wp-erp'), value: 'high' },
										{ label: __('Urgent', 'wp-erp'), value: 'urgent' },
									]}
									onChange={(value) => setFormData({ ...formData, priority: value })}
								/>
							</FlexBlock>
							<Flex justify="flex-start">
								<Button variant="primary" type="submit" isBusy={isCreating}>
									{__('Create Ticket', 'wp-erp')}
								</Button>
							</Flex>
						</Flex>
					</form>
				</CardBody>
			</Card>

			<Card>
				<CardHeader>
					<h2 style={{ margin: 0 }}>{__('Tickets', 'wp-erp')}</h2>
				</CardHeader>
				<CardBody>
					{loading ? (
						<Flex justify="center" style={{ padding: '32px' }}>
							<Spinner />
						</Flex>
					) : tickets.length === 0 ? (
						<p style={{ padding: '16px', textAlign: 'center', color: '#757575' }}>
							{__('No tickets found.', 'wp-erp')}
						</p>
					) : (
						<div style={{ overflowX: 'auto' }}>
							<table className="wp-list-table widefat fixed striped">
								<thead>
									<tr>
										<th>{__('Ticket No', 'wp-erp')}</th>
										<th>{__('Subject', 'wp-erp')}</th>
										<th>{__('Priority', 'wp-erp')}</th>
										<th>{__('Status', 'wp-erp')}</th>
										<th>{__('Created', 'wp-erp')}</th>
									</tr>
								</thead>
								<tbody>
									{tickets.map((ticket) => (
										<tr key={ticket.id}>
											<td><strong>{ticket.ticket_no}</strong></td>
											<td>{ticket.subject}</td>
											<td>
												<span style={{
													padding: '4px 8px',
													borderRadius: '2px',
													backgroundColor: ticket.priority === 'urgent' ? '#d63638' : ticket.priority === 'high' ? '#dba617' : ticket.priority === 'medium' ? '#2271b1' : '#00a32a',
													color: '#fff',
													fontSize: '12px',
													textTransform: 'capitalize'
												}}>
													{ticket.priority}
												</span>
											</td>
											<td>
												<span style={{
													padding: '4px 8px',
													borderRadius: '2px',
													backgroundColor: ticket.status === 'open' ? '#d63638' : ticket.status === 'closed' ? '#757575' : '#00a32a',
													color: '#fff',
													fontSize: '12px',
													textTransform: 'capitalize'
												}}>
													{ticket.status}
												</span>
											</td>
											<td>{ticket.created_at}</td>
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

export default HelpdeskApp;

