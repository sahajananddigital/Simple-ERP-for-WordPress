/**
 * Webpack configuration for WP ERP
 * This is handled by @wordpress/scripts, but we can customize if needed
 */
const defaultConfig = require('@wordpress/scripts/config/webpack.config');

module.exports = {
	...defaultConfig,
	// Add any custom webpack configuration here if needed
};

