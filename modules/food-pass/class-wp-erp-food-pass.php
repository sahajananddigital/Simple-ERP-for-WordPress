<?php
/**
 * Food Pass Module
 *
 * @package WP_ERP
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class WP_ERP_Food_Pass {
	
	/**
	 * Module slug
	 *
	 * @var string
	 */
	public $slug = 'food-pass';
	
	/**
	 * Module name
	 *
	 * @var string
	 */
	public $name = 'Food Pass';
	
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
			__( 'Food Pass', 'wp-erp' ),
			__( 'Food Pass', 'wp-erp' ),
			'manage_options',
			'wp-erp-food-pass',
			array( $this, 'render_page' ),
			'dashicons-food',
			37
		);
		
		add_submenu_page(
			'wp-erp-food-pass',
			__( 'All Food Passes', 'wp-erp' ),
			__( 'All Food Passes', 'wp-erp' ),
			'manage_options',
			'wp-erp-food-pass',
			array( $this, 'render_page' )
		);
		
		add_submenu_page(
			'wp-erp-food-pass',
			__( 'Create Food Pass', 'wp-erp' ),
			__( 'Create Food Pass', 'wp-erp' ),
			'manage_options',
			'wp-erp-food-pass-create',
			array( $this, 'render_create_page' )
		);
	}
	
	/**
	 * Render Food Pass page
	 */
	public function render_page() {
		?>
		<div class="wrap">
			<h1><?php echo esc_html( $this->name ); ?></h1>
			<div id="wp-erp-food-pass-root"></div>
		</div>
		<?php
	}
	
	/**
	 * Render Create Food Pass page
	 */
	public function render_create_page() {
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'Create Food Pass', 'wp-erp' ); ?></h1>
			<div id="wp-erp-food-pass-create-root"></div>
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

