/**
 * Vouchers App Tests
 */
import { render, screen, waitFor } from '@testing-library/react';
import VouchersApp from '../../../src/modules/vouchers/App';
import apiFetch from '@wordpress/api-fetch';

jest.mock( '@wordpress/api-fetch' );

describe( 'VouchersApp', () => {
	beforeEach( () => {
		apiFetch.mockClear();
	} );

	it( 'renders Vouchers module', () => {
		apiFetch.mockResolvedValue( [] );
		render( <VouchersApp /> );
		expect( screen.getByText( /Vouchers/i ) ).toBeInTheDocument();
	} );

	it( 'fetches and displays vouchers', async () => {
		const mockVouchers = [
			{
				id: 1,
				voucher_no: 'VCH-001',
				voucher_type: 'payment',
				date: '2024-01-01',
				party_name: 'Test Party',
				amount: 1000.0,
				status: 'draft',
			},
		];

		apiFetch.mockResolvedValue( mockVouchers );
		render( <VouchersApp /> );

		await waitFor( () => {
			expect( screen.getByText( 'VCH-001' ) ).toBeInTheDocument();
		} );
	} );

	it( 'renders create voucher form', () => {
		render( <VouchersApp view="create" /> );
		// Check for form-specific field instead of title which might appear multiple times
		expect( screen.getByLabelText( /Voucher Type/i ) ).toBeInTheDocument();
	} );
} );
