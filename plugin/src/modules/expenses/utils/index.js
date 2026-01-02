/**
 * Expenses Utilities
 */

export const getStatusColor = ( status ) => {
	switch ( status ) {
		case 'approved':
			return '#00a32a';
		case 'rejected':
			return '#d63638';
		default:
			return '#dba617';
	}
};
