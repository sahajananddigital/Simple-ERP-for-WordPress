/**
 * CRM Utilities
 */

export const getStatusColor = ( status ) => {
	switch ( status ) {
		case 'customer':
			return '#00a32a';
		case 'opportunity':
			return '#2271b1';
		default:
			return '#dba617';
	}
};
