/**
 * CRM Module App
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
	Spinner,
	Notice,
	Flex,
	FlexBlock,
} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

const CRMApp = () => {
	const [contacts, setContacts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isCreating, setIsCreating] = useState(false);
	const [formData, setFormData] = useState({
		first_name: '',
		last_name: '',
		email: '',
		phone: '',
		company: '',
		status: 'lead',
		type: 'contact',
	});

	useEffect(() => {
		fetchContacts();
	}, []);

	const fetchContacts = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await apiFetch({ path: '/wp-erp/v1/crm/contacts' });
			setContacts(data);
		} catch (err) {
			setError(err.message || __('Failed to fetch contacts', 'wp-erp'));
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
				path: '/wp-erp/v1/crm/contacts',
				method: 'POST',
				data: formData,
			});
			setFormData({
				first_name: '',
				last_name: '',
				email: '',
				phone: '',
				company: '',
				status: 'lead',
				type: 'contact',
			});
			fetchContacts();
		} catch (err) {
			setError(err.message || __('Failed to create contact', 'wp-erp'));
		} finally {
			setIsCreating(false);
		}
	};

	return (
		<div className="wp-erp-crm" style={{ padding: '16px' }}>
			{error && (
				<Notice status="error" isDismissible={false} onRemove={() => setError(null)}>
					{error}
				</Notice>
			)}

			<Card style={{ marginBottom: '24px' }}>
				<CardHeader>
					<h2 style={{ margin: 0 }}>{__('Add New Contact', 'wp-erp')}</h2>
				</CardHeader>
				<CardBody>
					<form onSubmit={handleSubmit}>
						<Flex direction="column" gap={4}>
							<Flex>
								<FlexBlock>
									<TextControl
										label={__('First Name', 'wp-erp')}
										value={formData.first_name}
										onChange={(value) => setFormData({ ...formData, first_name: value })}
										required
									/>
								</FlexBlock>
								<FlexBlock>
									<TextControl
										label={__('Last Name', 'wp-erp')}
										value={formData.last_name}
										onChange={(value) => setFormData({ ...formData, last_name: value })}
										required
									/>
								</FlexBlock>
							</Flex>
							<Flex>
								<FlexBlock>
									<TextControl
										label={__('Email', 'wp-erp')}
										type="email"
										value={formData.email}
										onChange={(value) => setFormData({ ...formData, email: value })}
									/>
								</FlexBlock>
								<FlexBlock>
									<TextControl
										label={__('Phone', 'wp-erp')}
										value={formData.phone}
										onChange={(value) => setFormData({ ...formData, phone: value })}
									/>
								</FlexBlock>
							</Flex>
							<Flex>
								<FlexBlock>
									<TextControl
										label={__('Company', 'wp-erp')}
										value={formData.company}
										onChange={(value) => setFormData({ ...formData, company: value })}
									/>
								</FlexBlock>
								<FlexBlock>
									<SelectControl
										label={__('Status', 'wp-erp')}
										value={formData.status}
										options={[
											{ label: __('Lead', 'wp-erp'), value: 'lead' },
											{ label: __('Customer', 'wp-erp'), value: 'customer' },
											{ label: __('Opportunity', 'wp-erp'), value: 'opportunity' },
										]}
										onChange={(value) => setFormData({ ...formData, status: value })}
									/>
								</FlexBlock>
							</Flex>
							<Flex justify="flex-start">
								<Button variant="primary" type="submit" isBusy={isCreating}>
									{__('Add Contact', 'wp-erp')}
								</Button>
							</Flex>
						</Flex>
					</form>
				</CardBody>
			</Card>

			<Card>
				<CardHeader>
					<h2 style={{ margin: 0 }}>{__('Contacts', 'wp-erp')}</h2>
				</CardHeader>
				<CardBody>
					{loading ? (
						<Flex justify="center" style={{ padding: '32px' }}>
							<Spinner />
						</Flex>
					) : contacts.length === 0 ? (
						<p style={{ padding: '16px', textAlign: 'center', color: '#757575' }}>
							{__('No contacts found.', 'wp-erp')}
						</p>
					) : (
						<div style={{ overflowX: 'auto' }}>
							<table className="wp-list-table widefat fixed striped">
								<thead>
									<tr>
										<th>{__('Name', 'wp-erp')}</th>
										<th>{__('Email', 'wp-erp')}</th>
										<th>{__('Phone', 'wp-erp')}</th>
										<th>{__('Company', 'wp-erp')}</th>
										<th>{__('Status', 'wp-erp')}</th>
									</tr>
								</thead>
								<tbody>
									{contacts.map((contact) => (
										<tr key={contact.id}>
											<td>
												<strong>{contact.first_name} {contact.last_name}</strong>
											</td>
											<td>{contact.email || '-'}</td>
											<td>{contact.phone || '-'}</td>
											<td>{contact.company || '-'}</td>
											<td>
												<span style={{
													padding: '4px 8px',
													borderRadius: '2px',
													backgroundColor: contact.status === 'customer' ? '#00a32a' : contact.status === 'opportunity' ? '#2271b1' : '#dba617',
													color: '#fff',
													fontSize: '12px',
													textTransform: 'capitalize'
												}}>
													{contact.status}
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

export default CRMApp;

