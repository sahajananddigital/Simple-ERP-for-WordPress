/**
 * CRM API Service
 */
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';

export const fetchContacts = async () => {
	try {
		return await apiFetch( { path: '/wp-erp/v1/crm/contacts' } );
	} catch ( err ) {
		throw new Error(
			err.message || __( 'Failed to fetch contacts', 'wp-erp' )
		);
	}
};

export const createContact = async ( payload ) => {
	try {
		return await apiFetch( {
			path: '/wp-erp/v1/crm/contacts',
			method: 'POST',
			data: payload,
		} );
	} catch ( err ) {
		throw new Error(
			err.message || __( 'Failed to create contact', 'wp-erp' )
		);
	}
};
