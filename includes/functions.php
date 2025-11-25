<?php
/**
 * Helper functions
 *
 * @package WP_ERP
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Get ERP module
 *
 * @param string $slug Module slug
 * @return object|null
 */
function wp_erp_get_module( $slug ) {
	$erp = WP_ERP();
	return $erp->modules->get_module( $slug );
}

/**
 * Check if module is active
 *
 * @param string $slug Module slug
 * @return bool
 */
function wp_erp_is_module_active( $slug ) {
	$erp = WP_ERP();
	return $erp->modules->is_module_active( $slug );
}

