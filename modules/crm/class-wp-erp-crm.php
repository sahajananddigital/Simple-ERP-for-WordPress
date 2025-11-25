<?php
/**
 * CRM Module
 *
 * @package WP_ERP
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class WP_ERP_CRM {
	
	/**
	 * Module slug
	 *
	 * @var string
	 */
	public $slug = 'crm';
	
	/**
	 * Module name
	 *
	 * @var string
	 */
	public $name = 'CRM';
	
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
			__( 'CRM', 'wp-erp' ),
			__( 'CRM', 'wp-erp' ),
			'manage_options',
			'wp-erp-crm',
			array( $this, 'render_page' ),
			'dashicons-groups',
			30
		);
		
		add_submenu_page(
			'wp-erp-crm',
			__( 'Contacts', 'wp-erp' ),
			__( 'Contacts', 'wp-erp' ),
			'manage_options',
			'wp-erp-crm',
			array( $this, 'render_page' )
		);
	}
	
	/**
	 * Render CRM page
	 */
	public function render_page() {
		?>
		<div class="wrap">
			<h1><?php echo esc_html( $this->name ); ?></h1>
			<div id="wp-erp-crm-root"></div>
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

