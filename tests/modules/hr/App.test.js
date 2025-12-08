/**
 * HR App Tests
 */
import { render, screen, waitFor } from '@testing-library/react';
import HRApp from '../../../src/modules/hr/App';
import apiFetch from '@wordpress/api-fetch';

jest.mock( '@wordpress/api-fetch' );

describe( 'HRApp', () => {
	beforeEach( () => {
		apiFetch.mockClear();
	} );

	it( 'renders HR module', () => {
		apiFetch.mockResolvedValue( [] );
		render( <HRApp /> );
		expect( screen.getByText( /Employees/i ) ).toBeInTheDocument();
	} );

	it( 'fetches and displays employees', async () => {
		const mockEmployees = [
			{
				id: 1,
				employee_id: 'EMP001',
				user_id: 1,
				designation: 'Developer',
				department: 'IT',
				status: 'active',
			},
		];

		apiFetch.mockResolvedValue( mockEmployees );
		render( <HRApp /> );

		await waitFor( () => {
			expect( screen.getByText( 'EMP001' ) ).toBeInTheDocument();
		} );
	} );

	it( 'displays leaves view', () => {
		render( <HRApp view="leaves" /> );
		expect( screen.getByText( /Leave Requests/i ) ).toBeInTheDocument();
	} );
} );
