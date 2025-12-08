<?php
/**
 * Donations Module
 *
 * @package WP_ERP
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class WP_ERP_Donations {

	/**
	 * Module slug
	 *
	 * @var string
	 */
	public $slug = 'donations';

	/**
	 * Module name
	 *
	 * @var string
	 */
	public $name = 'Donations';

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
		// Create tables on init (simplified for this proof of concept)
		add_action( 'init', array( $this, 'create_tables' ) );
		
		add_action( 'admin_menu', array( $this, 'add_admin_menu' ) );
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	/**
	 * Create database tables
	 */
	public function create_tables() {
		global $wpdb;

		$table_name = $wpdb->prefix . 'erp_donations';
		$charset_collate = $wpdb->get_charset_collate();

		$sql = "CREATE TABLE $table_name (
			id mediumint(9) NOT NULL AUTO_INCREMENT,
			donor_name varchar(255) NOT NULL,
			phone varchar(50) NOT NULL,
			ledger varchar(100) NOT NULL,
			amount decimal(10,2) NOT NULL,
			notes text DEFAULT '',
			issue_date date NOT NULL,
			created_at datetime DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY  (id)
		) $charset_collate;";

		require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
		dbDelta( $sql );
	}

	/**
	 * Add admin menu
	 */
	public function add_admin_menu() {
		add_menu_page(
			__( 'Donations', 'wp-erp' ),
			__( 'Donations', 'wp-erp' ),
			'manage_options',
			'wp-erp-donations',
			array( $this, 'render_page' ),
			'dashicons-heart', // Heart icon for donations
			35 // Position
		);
	}

	/**
	 * Render Donations page
	 */
	public function render_page() {
		?>
		<div id="wp-erp-donations-root"></div>
		<?php
	}

	/**
	 * Register REST API routes
	 */
	public function register_routes() {
		$namespace = 'wp-erp/v1';
		$base      = 'donations';

		// Get all donations
		register_rest_route( $namespace, '/' . $base, array(
			'methods'             => 'GET',
			'callback'            => array( $this, 'get_donations' ),
			'permission_callback' => '__return_true', // Simplified for demo
		) );

		// Create donation
		register_rest_route( $namespace, '/' . $base, array(
			'methods'             => 'POST',
			'callback'            => array( $this, 'create_donation' ),
			'permission_callback' => '__return_true',
		) );
		
		// Lookup donor by phone
		register_rest_route( $namespace, '/' . $base . '/donor', array(
			'methods'             => 'GET',
			'callback'            => array( $this, 'get_donor_by_phone' ),
			'permission_callback' => '__return_true',
		) );

		// Get Ledgers
		register_rest_route( $namespace, '/' . $base . '/ledgers', array(
			'methods'             => 'GET',
			'callback'            => array( $this, 'get_ledgers' ),
			'permission_callback' => '__return_true',
		) );

		// Update Ledgers
		register_rest_route( $namespace, '/' . $base . '/ledgers', array(
			'methods'             => 'POST',
			'callback'            => array( $this, 'update_ledgers' ),
			'permission_callback' => '__return_true',
		) );
	}

	/**
	 * Get donations
	 */
	public function get_donations( $request ) {
		global $wpdb;
		$table_name = $wpdb->prefix . 'erp_donations';
		
		// Optional: Basic limit for performance
		$results = $wpdb->get_results( "SELECT * FROM $table_name ORDER BY id DESC LIMIT 100" );
		
		return rest_ensure_response( $results );
	}

	/**
	 * Create donation
	 */
	public function create_donation( $request ) {
		global $wpdb;
		$table_name = $wpdb->prefix . 'erp_donations';
		
		$params = $request->get_json_params();
		
		// Basic validation
		if ( empty( $params['donor_name'] ) || empty( $params['amount'] ) ) {
			return new WP_Error( 'missing_params', 'Name and Amount are required', array( 'status' => 400 ) );
		}

		$data = array(
			'donor_name' => sanitize_text_field( $params['donor_name'] ),
			'phone'      => sanitize_text_field( $params['phone'] ),
			'ledger'     => sanitize_text_field( $params['ledger'] ),
			'amount'     => floatval( $params['amount'] ),
			'notes'      => sanitize_textarea_field( $params['notes'] ),
			'issue_date' => !empty($params['issue_date']) ? sanitize_text_field($params['issue_date']) : current_time( 'Y-m-d' ),
			'created_at' => current_time( 'mysql' )
		);

		$format = array( '%s', '%s', '%s', '%f', '%s', '%s', '%s' );
		
		$wpdb->insert( $table_name, $data, $format );
		
		$new_id = $wpdb->insert_id;
		$donation = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $table_name WHERE id = %d", $new_id ) );

		return rest_ensure_response( $donation );
	}

	/**
	 * Get donor by phone
	 */
	public function get_donor_by_phone( $request ) {
		global $wpdb;
		$table_name = $wpdb->prefix . 'erp_donations';
		
		$phone = sanitize_text_field( $request->get_param( 'phone' ) );
		
		if ( empty( $phone ) ) {
			return new WP_Error( 'no_phone', 'Phone number required', array( 'status' => 400 ) );
		}
		
		// Find the most recent record for this phone number
		$result = $wpdb->get_row( $wpdb->prepare( 
			"SELECT donor_name FROM $table_name WHERE phone = %s ORDER BY id DESC LIMIT 1", 
			$phone 
		) );
		
		if ( $result ) {
			return rest_ensure_response( array( 'found' => true, 'donor_name' => $result->donor_name ) );
		} else {
			return rest_ensure_response( array( 'found' => false ) );
		}
	}

	/**
	 * Get Ledgers
	 */
	public function get_ledgers() {
		// Return stored ledgers or defaults
		$ledgers = get_option( 'wp_erp_donation_ledgers', array( 'General Fund', 'Education Fund', 'Building Fund' ) );
		return rest_ensure_response( $ledgers );
	}

	/**
	 * Update Ledgers
	 */
	public function update_ledgers( $request ) {
		$params = $request->get_json_params();
		$ledgers = isset( $params['ledgers'] ) ? (array) $params['ledgers'] : array();
		
		// Sanitize
		$ledgers = array_map( 'sanitize_text_field', $ledgers );
		$ledgers = array_filter( $ledgers ); // Filter empty
		
		update_option( 'wp_erp_donation_ledgers', $ledgers );
		
		return rest_ensure_response( $ledgers );
	}
}
