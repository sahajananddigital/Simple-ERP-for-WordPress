<?php
/**
 * Vouchers Module
 *
 * @package WP_ERP
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class WP_ERP_Vouchers {
	
	/**
	 * Module slug
	 *
	 * @var string
	 */
	public $slug = 'vouchers';
	
	/**
	 * Module name
	 *
	 * @var string
	 */
	public $name = 'Vouchers';
	
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
			__( 'Vouchers', 'wp-erp' ),
			__( 'Vouchers', 'wp-erp' ),
			'manage_options',
			'wp-erp-vouchers',
			array( $this, 'render_page' ),
			'dashicons-tickets',
			34
		);
		
		add_submenu_page(
			'wp-erp-vouchers',
			__( 'All Vouchers', 'wp-erp' ),
			__( 'All Vouchers', 'wp-erp' ),
			'manage_options',
			'wp-erp-vouchers',
			array( $this, 'render_page' )
		);
		
		add_submenu_page(
			'wp-erp-vouchers',
			__( 'Create Voucher', 'wp-erp' ),
			__( 'Create Voucher', 'wp-erp' ),
			'manage_options',
			'wp-erp-vouchers-create',
			array( $this, 'render_create_page' )
		);
	}
	
	/**
	 * Render Vouchers page
	 */
	public function render_page() {
		?>
		<div class="wrap">
			<h1><?php echo esc_html( $this->name ); ?></h1>
			<div id="wp-erp-vouchers-root"></div>
		</div>
		<?php
	}
	
	/**
	 * Render Create Voucher page
	 */
	public function render_create_page() {
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'Create Voucher', 'wp-erp' ); ?></h1>
			<div id="wp-erp-vouchers-create-root"></div>
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

