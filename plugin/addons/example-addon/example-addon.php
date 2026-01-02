<?php
/**
 * Plugin Name: WP ERP Addon - Example Addon
 * Description: Example addon demonstrating how to extend WP ERP
 * Version: 1.0.0
 * Author: Your Name
 * Requires WP ERP: 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Example Addon Class
 */
class WP_ERP_Addon_Example_Addon {
	
	/**
	 * Constructor
	 */
	public function __construct() {
		add_action( 'wp_erp_init', array( $this, 'init' ) );
		add_action( 'admin_menu', array( $this, 'add_menu' ) );
	}
	
	/**
	 * Initialize addon
	 */
	public function init() {
		// Add custom functionality here
		// You can hook into WP ERP actions and filters
		do_action( 'wp_erp_example_addon_init' );
	}
	
	/**
	 * Add admin menu
	 */
	public function add_menu() {
		add_submenu_page(
			'wp-erp-crm',
			__( 'Example Addon', 'wp-erp' ),
			__( 'Example Addon', 'wp-erp' ),
			'manage_options',
			'wp-erp-example-addon',
			array( $this, 'render_page' )
		);
	}
	
	/**
	 * Render addon page
	 */
	public function render_page() {
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'Example Addon', 'wp-erp' ); ?></h1>
			<p><?php esc_html_e( 'This is an example addon for WP ERP.', 'wp-erp' ); ?></p>
		</div>
		<?php
	}
}

// Initialize addon
new WP_ERP_Addon_Example_Addon();

