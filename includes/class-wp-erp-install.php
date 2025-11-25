<?php
/**
 * Installation and activation handler
 *
 * @package WP_ERP
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class WP_ERP_Install {
	
	/**
	 * Install plugin
	 */
	public static function install() {
		global $wpdb;
		
		// Create database tables
		WP_ERP_Database::create_tables();
		
		// Set default options
		add_option( 'wp_erp_version', WP_ERP_VERSION );
		add_option( 'wp_erp_installed', current_time( 'mysql' ) );
		
		// Flush rewrite rules
		flush_rewrite_rules();
		
		do_action( 'wp_erp_installed' );
	}
	
	/**
	 * Deactivate plugin
	 */
	public static function deactivate() {
		flush_rewrite_rules();
		do_action( 'wp_erp_deactivated' );
	}
}

