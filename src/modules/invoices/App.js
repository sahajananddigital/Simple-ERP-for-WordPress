/**
 * Invoices Module App
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
	Spinner,
	Notice,
	Flex,
	FlexBlock,
} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

const InvoicesApp = ({ view = 'list' }) => {
	const [invoices, setInvoices] = useState([]);
	const [contacts, setContacts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isCreating, setIsCreating] = useState(false);
	const [formData, setFormData] = useState({
		contact_id: '',
		invoice_date: new Date().toISOString().split('T')[0],
		due_date: '',
		subtotal: '',
		tax_amount: '',
		total_amount: '',
		notes: '',
		status: 'draft',
	});

	useEffect(() => {
		if (view === 'list') {
			fetchInvoices();
		}
		fetchContacts();
	}, [view]);

	const fetchInvoices = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await apiFetch({ path: '/wp-erp/v1/invoices' });
			setInvoices(data);
		} catch (err) {
			setError(err.message || __('Failed to fetch invoices', 'wp-erp'));
		} finally {
			setLoading(false);
		}
	};

	const fetchContacts = async () => {
		try {
			const data = await apiFetch({ path: '/wp-erp/v1/crm/contacts' });
			setContacts(data);
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
				path: '/wp-erp/v1/invoices',
				method: 'POST',
				data: formData,
			});
			if (view === 'create') {
				window.location.href = 'admin.php?page=wp-erp-invoices';
			} else {
				fetchInvoices();
			}
		} catch (err) {
			setError(err.message || __('Failed to create invoice', 'wp-erp'));
		} finally {
			setIsCreating(false);
		}
	};

	if (view === 'create') {
		return (
			<div className="wp-erp-invoices" style={{ padding: '16px' }}>
				{error && (
					<Notice status="error" isDismissible={false} onRemove={() => setError(null)}>
						{error}
					</Notice>
				)}

				<Card>
					<CardHeader>
						<h2 style={{ margin: 0 }}>{__('Create Invoice', 'wp-erp')}</h2>
					</CardHeader>
					<CardBody>
						<form onSubmit={handleSubmit}>
							<Flex direction="column" gap={4}>
								<Flex>
									<FlexBlock>
										<TextControl
											label={__('Invoice Date', 'wp-erp')}
											type="date"
											value={formData.invoice_date}
											onChange={(value) => setFormData({ ...formData, invoice_date: value })}
											required
										/>
									</FlexBlock>
									<FlexBlock>
										<TextControl
											label={__('Due Date', 'wp-erp')}
											type="date"
											value={formData.due_date}
											onChange={(value) => setFormData({ ...formData, due_date: value })}
										/>
									</FlexBlock>
								</Flex>
								<FlexBlock>
									<TextControl
										label={__('Subtotal', 'wp-erp')}
										type="number"
										step="0.01"
										value={formData.subtotal}
										onChange={(value) => {
											const subtotal = parseFloat(value) || 0;
											const tax = parseFloat(formData.tax_amount) || 0;
											setFormData({ ...formData, subtotal: value, total_amount: (subtotal + tax).toFixed(2) });
										}}
									/>
								</FlexBlock>
								<FlexBlock>
									<TextControl
										label={__('Tax Amount', 'wp-erp')}
										type="number"
										step="0.01"
										value={formData.tax_amount}
										onChange={(value) => {
											const subtotal = parseFloat(formData.subtotal) || 0;
											const tax = parseFloat(value) || 0;
											setFormData({ ...formData, tax_amount: value, total_amount: (subtotal + tax).toFixed(2) });
										}}
									/>
								</FlexBlock>
								<FlexBlock>
									<TextControl
										label={__('Total Amount', 'wp-erp')}
										type="number"
										step="0.01"
										value={formData.total_amount}
										readOnly
									/>
								</FlexBlock>
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
										{__('Create Invoice', 'wp-erp')}
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
		<div className="wp-erp-invoices" style={{ padding: '16px' }}>
			{error && (
				<Notice status="error" isDismissible={false} onRemove={() => setError(null)}>
					{error}
				</Notice>
			)}

			<Card>
				<CardHeader>
					<Flex justify="space-between" align="center">
						<h2 style={{ margin: 0 }}>{__('Invoices', 'wp-erp')}</h2>
						<Button variant="primary" href="admin.php?page=wp-erp-invoices-create">
							{__('Create Invoice', 'wp-erp')}
						</Button>
					</Flex>
				</CardHeader>
				<CardBody>
					{loading ? (
						<Flex justify="center" style={{ padding: '32px' }}>
							<Spinner />
						</Flex>
					) : invoices.length === 0 ? (
						<p style={{ padding: '16px', textAlign: 'center', color: '#757575' }}>
							{__('No invoices found.', 'wp-erp')}
						</p>
					) : (
						<div style={{ overflowX: 'auto' }}>
							<table className="wp-list-table widefat fixed striped">
								<thead>
									<tr>
										<th>{__('Invoice No', 'wp-erp')}</th>
										<th>{__('Date', 'wp-erp')}</th>
										<th>{__('Due Date', 'wp-erp')}</th>
										<th>{__('Total Amount', 'wp-erp')}</th>
										<th>{__('Status', 'wp-erp')}</th>
									</tr>
								</thead>
								<tbody>
									{invoices.map((invoice) => (
										<tr key={invoice.id}>
											<td><strong>{invoice.invoice_no}</strong></td>
											<td>{invoice.invoice_date}</td>
											<td>{invoice.due_date || '-'}</td>
											<td><strong>{invoice.total_amount}</strong></td>
											<td>
												<span style={{
													padding: '4px 8px',
													borderRadius: '2px',
													backgroundColor: invoice.status === 'paid' ? '#00a32a' : invoice.status === 'draft' ? '#757575' : '#dba617',
													color: '#fff',
													fontSize: '12px',
													textTransform: 'capitalize'
												}}>
													{invoice.status}
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

export default InvoicesApp;

