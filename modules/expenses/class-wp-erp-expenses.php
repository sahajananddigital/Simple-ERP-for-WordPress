<?php
/**
 * Expenses Module
 *
 * @package WP_ERP
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class WP_ERP_Expenses {
	
	/**
	 * Module slug
	 *
	 * @var string
	 */
	public $slug = 'expenses';
	
	/**
	 * Module name
	 *
	 * @var string
	 */
	public $name = 'Expenses';
	
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
			__( 'Expenses', 'wp-erp' ),
			__( 'Expenses', 'wp-erp' ),
			'manage_options',
			'wp-erp-expenses',
			array( $this, 'render_page' ),
			'dashicons-money-alt',
			36
		);
		
		add_submenu_page(
			'wp-erp-expenses',
			__( 'All Expenses', 'wp-erp' ),
			__( 'All Expenses', 'wp-erp' ),
			'manage_options',
			'wp-erp-expenses',
			array( $this, 'render_page' )
		);
		
		add_submenu_page(
			'wp-erp-expenses',
			__( 'Add Expense', 'wp-erp' ),
			__( 'Add Expense', 'wp-erp' ),
			'manage_options',
			'wp-erp-expenses-create',
			array( $this, 'render_create_page' )
		);
	}
	
	/**
	 * Render Expenses page
	 */
	public function render_page() {
		?>
		<div class="wrap">
			<h1><?php echo esc_html( $this->name ); ?></h1>
			<div id="wp-erp-expenses-root"></div>
		</div>
		<?php
	}
	
	/**
	 * Render Create Expense page
	 */
	public function render_create_page() {
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'Add Expense', 'wp-erp' ); ?></h1>
			<div id="wp-erp-expenses-create-root"></div>
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

