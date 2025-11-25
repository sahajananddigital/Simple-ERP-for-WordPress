/**
 * Helpdesk App Tests
 */
import { render, screen, waitFor } from '@testing-library/react';
import HelpdeskApp from '../../../src/modules/helpdesk/App';
import apiFetch from '@wordpress/api-fetch';

jest.mock('@wordpress/api-fetch');

describe('HelpdeskApp', () => {
	beforeEach(() => {
		apiFetch.mockClear();
	});

	it('renders Helpdesk module', () => {
		apiFetch.mockResolvedValue([]);
		render(<HelpdeskApp />);
		expect(screen.getByText(/Create New Ticket/i)).toBeInTheDocument();
	});

	it('fetches and displays tickets', async () => {
		const mockTickets = [
			{
				id: 1,
				ticket_no: 'TKT-001',
				subject: 'Test Ticket',
				priority: 'high',
				status: 'open',
				created_at: '2024-01-01',
			},
		];

		apiFetch.mockResolvedValue(mockTickets);
		render(<HelpdeskApp />);

		await waitFor(() => {
			expect(screen.getByText('TKT-001')).toBeInTheDocument();
		});
	});

	it('handles fetch failure gracefully', async () => {
		apiFetch.mockRejectedValue(new Error('Network error'));
		
		// Component should render without crashing
		render(<HelpdeskApp />);
		
		// Verify component renders
		expect(screen.getByText(/Create New Ticket/i)).toBeInTheDocument();
		
		// Wait for async operations to complete
		await waitFor(() => {
			expect(screen.getByText(/Tickets/i)).toBeInTheDocument();
		}, { timeout: 2000 });
	});
});

