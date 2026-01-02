/**
 * Accounting API Service
 */
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';

export const fetchAccounts = async () => {
	try {
		return await apiFetch( { path: '/wp-erp/v1/accounting/accounts' } );
	} catch ( err ) {
		throw new Error(
			err.message || __( 'Failed to fetch accounts', 'wp-erp' )
		);
	}
};

export const fetchTransactions = async () => {
	try {
		return await apiFetch( { path: '/wp-erp/v1/accounting/transactions' } );
	} catch ( err ) {
		throw new Error(
			err.message || __( 'Failed to fetch transactions', 'wp-erp' )
		);
	}
};

export const createTransaction = async ( payload ) => {
	try {
		return await apiFetch( {
			path: '/wp-erp/v1/accounting/transactions',
			method: 'POST',
			data: payload,
		} );
	} catch ( err ) {
		throw new Error(
			err.message || __( 'Failed to create transaction', 'wp-erp' )
		);
	}
};
