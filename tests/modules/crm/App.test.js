/**
 * CRM App Tests
 */
import { render, screen, waitFor } from '@testing-library/react';
import { __ } from '@wordpress/i18n';
import CRMApp from '../../../src/modules/crm/App';
import apiFetch from '@wordpress/api-fetch';

jest.mock('@wordpress/api-fetch');

describe('CRMApp', () => {
	beforeEach(() => {
		apiFetch.mockClear();
	});

	it('renders CRM module', () => {
		apiFetch.mockResolvedValue([]);
		render(<CRMApp />);
		expect(screen.getByText(/Add New Contact/i)).toBeInTheDocument();
	});

	it('fetches and displays contacts', async () => {
		const mockContacts = [
			{
				id: 1,
				first_name: 'John',
				last_name: 'Doe',
				email: 'john@example.com',
				phone: '1234567890',
				company: 'Test Corp',
				status: 'lead',
			},
		];

		apiFetch.mockResolvedValue(mockContacts);
		render(<CRMApp />);

		await waitFor(() => {
			expect(screen.getByText('John Doe')).toBeInTheDocument();
		});
	});

	it('handles fetch failure gracefully', async () => {
		apiFetch.mockRejectedValue(new Error('Network error'));
		
		// Component should render without crashing
		render(<CRMApp />);
		
		// Verify component renders
		expect(screen.getByText(/Add New Contact/i)).toBeInTheDocument();
		
		// Wait for async operations to complete
		await waitFor(() => {
			expect(screen.getByText(/Contacts/i)).toBeInTheDocument();
		}, { timeout: 2000 });
	});
});

