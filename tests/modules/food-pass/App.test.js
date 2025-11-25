/**
 * Food Pass App Tests
 */
import { render, screen, waitFor } from '@testing-library/react';
import FoodPassApp from '../../../src/modules/food-pass/App';
import apiFetch from '@wordpress/api-fetch';

jest.mock('@wordpress/api-fetch');

describe('FoodPassApp', () => {
	beforeEach(() => {
		apiFetch.mockClear();
	});

	it('renders Food Pass module', () => {
		apiFetch.mockResolvedValue([]);
		render(<FoodPassApp />);
		expect(screen.getByText(/Food Passes/i)).toBeInTheDocument();
	});

	it('fetches and displays food passes', async () => {
		const mockFoodPasses = [
			{
				id: 1,
				pass_no: 'FP-001',
				issue_date: '2024-01-01',
				valid_from: '2024-01-01',
				valid_to: '2024-01-31',
				total_meals: 60,
				used_meals: 10,
				status: 'active',
			},
		];

		apiFetch.mockResolvedValue(mockFoodPasses);
		render(<FoodPassApp />);

		await waitFor(() => {
			expect(screen.getByText('FP-001')).toBeInTheDocument();
		});
	});

	it('renders create food pass form', () => {
		apiFetch.mockResolvedValue([]);
		render(<FoodPassApp view="create" />);
		// Check for form-specific field
		expect(screen.getByLabelText(/Issue Date/i)).toBeInTheDocument();
	});
});

