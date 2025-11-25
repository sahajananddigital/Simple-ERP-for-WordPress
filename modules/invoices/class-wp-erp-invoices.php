<?php
/**
 * Invoices Module
 *
 * @package WP_ERP
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class WP_ERP_Invoices {
	
	/**
	 * Module slug
	 *
	 * @var string
	 */
	public $slug = 'invoices';
	
	/**
	 * Module name
	 *
	 * @var string
	 */
	public $name = 'Invoices';
	
	/**
	 * Constructor
	 */
	public function __construct() {
		$this->init();
	}
	
	/**
	 * Initialize module
	 */
	private function init() {
		add_action( 'admin_menu', array( $this, 'add_admin_menu' ) );
	}
	
	/**
	 * Add admin menu
	 */
	public function add_admin_menu() {
		add_menu_page(
			__( 'Invoices', 'wp-erp' ),
			__( 'Invoices', 'wp-erp' ),
			'manage_options',
			'wp-erp-invoices',
			array( $this, 'render_page' ),
			'dashicons-media-document',
			35
		);
		
		add_submenu_page(
			'wp-erp-invoices',
			__( 'All Invoices', 'wp-erp' ),
			__( 'All Invoices', 'wp-erp' ),
			'manage_options',
			'wp-erp-invoices',
			array( $this, 'render_page' )
		);
		
		add_submenu_page(
			'wp-erp-invoices',
			__( 'Create Invoice', 'wp-erp' ),
			__( 'Create Invoice', 'wp-erp' ),
			'manage_options',
			'wp-erp-invoices-create',
			array( $this, 'render_create_page' )
		);
	}
	
	/**
	 * Render Invoices page
	 */
	public function render_page() {
		?>
		<div class="wrap">
			<h1><?php echo esc_html( $this->name ); ?></h1>
			<div id="wp-erp-invoices-root"></div>
		</div>
		<?php
	}
	
	/**
	 * Render Create Invoice page
	 */
	public function render_create_page() {
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'Create Invoice', 'wp-erp' ); ?></h1>
			<div id="wp-erp-invoices-create-root"></div>
		</div>
		<?php
	}
	
	/**
	 * Check if module is active
	 *
	 * @return bool
	 */
	public function is_active() {
		return true;
	}
}

