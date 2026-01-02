/**
 * Accounting App Tests
 */
import { render, screen, waitFor } from '@testing-library/react';
import AccountingApp from '../../../src/modules/accounting/App';
import apiFetch from '@wordpress/api-fetch';

jest.mock( '@wordpress/api-fetch' );

describe( 'AccountingApp', () => {
	beforeEach( () => {
		apiFetch.mockClear();
	} );

	it( 'renders Accounting module', () => {
		apiFetch.mockResolvedValue( [] );
		render( <AccountingApp /> );
		expect( screen.getByText( /Chart of Accounts/i ) ).toBeInTheDocument();
	} );

	it( 'fetches and displays accounts', async () => {
		const mockAccounts = [
			{
				id: 1,
				code: '1000',
				name: 'Cash',
				type: 'Asset',
				balance: 5000.0,
			},
		];

		apiFetch.mockResolvedValue( mockAccounts );
		render( <AccountingApp /> );

		await waitFor( () => {
			expect( screen.getByText( 'Cash' ) ).toBeInTheDocument();
		} );
	} );

	it( 'displays transactions view', () => {
		apiFetch.mockResolvedValue( [] );
		render( <AccountingApp view="transactions" /> );
		expect( screen.getByText( /Transactions/i ) ).toBeInTheDocument();
	} );
} );
