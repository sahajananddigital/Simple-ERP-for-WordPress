<?php
/**
 * HR Module
 *
 * @package WP_ERP
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class WP_ERP_HR {
	
	/**
	 * Module slug
	 *
	 * @var string
	 */
	public $slug = 'hr';
	
	/**
	 * Module name
	 *
	 * @var string
	 */
	public $name = 'HR';
	
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
			__( 'HR', 'wp-erp' ),
			__( 'HR', 'wp-erp' ),
			'manage_options',
			'wp-erp-hr',
			array( $this, 'render_page' ),
			'dashicons-id',
			32
		);
		
		add_submenu_page(
			'wp-erp-hr',
			__( 'Employees', 'wp-erp' ),
			__( 'Employees', 'wp-erp' ),
			'manage_options',
			'wp-erp-hr',
			array( $this, 'render_page' )
		);
		
		add_submenu_page(
			'wp-erp-hr',
			__( 'Leave Requests', 'wp-erp' ),
			__( 'Leave Requests', 'wp-erp' ),
			'manage_options',
			'wp-erp-hr-leaves',
			array( $this, 'render_leaves_page' )
		);
	}
	
	/**
	 * Render HR page
	 */
	public function render_page() {
		?>
		<div class="wrap">
			<h1><?php echo esc_html( $this->name ); ?></h1>
			<div id="wp-erp-hr-root"></div>
		</div>
		<?php
	}
	
	/**
	 * Render Leaves page
	 */
	public function render_leaves_page() {
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'Leave Requests', 'wp-erp' ); ?></h1>
			<div id="wp-erp-hr-leaves-root"></div>
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

