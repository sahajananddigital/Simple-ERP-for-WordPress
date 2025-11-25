<?php
/**
 * Helpdesk Module
 *
 * @package WP_ERP
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class WP_ERP_Helpdesk {
	
	/**
	 * Module slug
	 *
	 * @var string
	 */
	public $slug = 'helpdesk';
	
	/**
	 * Module name
	 *
	 * @var string
	 */
	public $name = 'Helpdesk';
	
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
			__( 'Helpdesk', 'wp-erp' ),
			__( 'Helpdesk', 'wp-erp' ),
			'manage_options',
			'wp-erp-helpdesk',
			array( $this, 'render_page' ),
			'dashicons-tickets-alt',
			33
		);
		
		add_submenu_page(
			'wp-erp-helpdesk',
			__( 'Tickets', 'wp-erp' ),
			__( 'Tickets', 'wp-erp' ),
			'manage_options',
			'wp-erp-helpdesk',
			array( $this, 'render_page' )
		);
	}
	
	/**
	 * Render Helpdesk page
	 */
	public function render_page() {
		?>
		<div class="wrap">
			<h1><?php echo esc_html( $this->name ); ?></h1>
			<div id="wp-erp-helpdesk-root"></div>
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

