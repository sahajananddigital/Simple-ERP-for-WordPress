<?php
/**
 * Accounting Module
 *
 * @package WP_ERP
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class WP_ERP_Accounting {
	
	/**
	 * Module slug
	 *
	 * @var string
	 */
	public $slug = 'accounting';
	
	/**
	 * Module name
	 *
	 * @var string
	 */
	public $name = 'Accounting';
	
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
			__( 'Accounting', 'wp-erp' ),
			__( 'Accounting', 'wp-erp' ),
			'manage_options',
			'wp-erp-accounting',
			array( $this, 'render_page' ),
			'dashicons-chart-line',
			31
		);
		
		add_submenu_page(
			'wp-erp-accounting',
			__( 'Chart of Accounts', 'wp-erp' ),
			__( 'Chart of Accounts', 'wp-erp' ),
			'manage_options',
			'wp-erp-accounting',
			array( $this, 'render_page' )
		);
		
		add_submenu_page(
			'wp-erp-accounting',
			__( 'Transactions', 'wp-erp' ),
			__( 'Transactions', 'wp-erp' ),
			'manage_options',
			'wp-erp-accounting-transactions',
			array( $this, 'render_transactions_page' )
		);
	}
	
	/**
	 * Render Accounting page
	 */
	public function render_page() {
		?>
		<div class="wrap">
			<h1><?php echo esc_html( $this->name ); ?></h1>
			<div id="wp-erp-accounting-root"></div>
		</div>
		<?php
	}
	
	/**
	 * Render Transactions page
	 */
	public function render_transactions_page() {
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'Transactions', 'wp-erp' ); ?></h1>
			<div id="wp-erp-accounting-transactions-root"></div>
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

