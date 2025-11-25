<?php
/**
 * REST API Handler
 *
 * @package WP_ERP
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class WP_ERP_API {
	
	/**
	 * Check if a database table exists
	 *
	 * @param string $table_name Table name
	 * @return bool
	 */
	private function table_exists( $table_name ) {
		global $wpdb;
		return $wpdb->get_var( "SHOW TABLES LIKE '$table_name'" ) == $table_name;
	}
	
	/**
	 * Register REST API routes
	 */
	public function register_routes() {
		$namespace = 'wp-erp/v1';
		
		// CRM Routes
		register_rest_route( $namespace, '/crm/contacts', array(
			array(
				'methods' => WP_REST_Server::READABLE,
				'callback' => array( $this, 'get_contacts' ),
				'permission_callback' => array( $this, 'check_permission' ),
			),
			array(
				'methods' => WP_REST_Server::CREATABLE,
				'callback' => array( $this, 'create_contact' ),
				'permission_callback' => array( $this, 'check_permission' ),
			),
		) );
		
		register_rest_route( $namespace, '/crm/contacts/(?P<id>\d+)', array(
			array(
				'methods' => WP_REST_Server::READABLE,
				'callback' => array( $this, 'get_contact' ),
				'permission_callback' => array( $this, 'check_permission' ),
			),
			array(
				'methods' => WP_REST_Server::EDITABLE,
				'callback' => array( $this, 'update_contact' ),
				'permission_callback' => array( $this, 'check_permission' ),
			),
			array(
				'methods' => WP_REST_Server::DELETABLE,
				'callback' => array( $this, 'delete_contact' ),
				'permission_callback' => array( $this, 'check_permission' ),
			),
		) );
		
		// Accounting Routes
		register_rest_route( $namespace, '/accounting/accounts', array(
			array(
				'methods' => WP_REST_Server::READABLE,
				'callback' => array( $this, 'get_accounts' ),
				'permission_callback' => array( $this, 'check_permission' ),
			),
		) );
		
		register_rest_route( $namespace, '/accounting/transactions', array(
			array(
				'methods' => WP_REST_Server::READABLE,
				'callback' => array( $this, 'get_transactions' ),
				'permission_callback' => array( $this, 'check_permission' ),
			),
			array(
				'methods' => WP_REST_Server::CREATABLE,
				'callback' => array( $this, 'create_transaction' ),
				'permission_callback' => array( $this, 'check_permission' ),
			),
		) );
		
		// HR Routes
		register_rest_route( $namespace, '/hr/employees', array(
			array(
				'methods' => WP_REST_Server::READABLE,
				'callback' => array( $this, 'get_employees' ),
				'permission_callback' => array( $this, 'check_permission' ),
			),
		) );
		
		// Helpdesk Routes
		register_rest_route( $namespace, '/helpdesk/tickets', array(
			array(
				'methods' => WP_REST_Server::READABLE,
				'callback' => array( $this, 'get_tickets' ),
				'permission_callback' => array( $this, 'check_permission' ),
			),
			array(
				'methods' => WP_REST_Server::CREATABLE,
				'callback' => array( $this, 'create_ticket' ),
				'permission_callback' => array( $this, 'check_permission' ),
			),
		) );
		
		// Vouchers Routes
		register_rest_route( $namespace, '/vouchers', array(
			array(
				'methods' => WP_REST_Server::READABLE,
				'callback' => array( $this, 'get_vouchers' ),
				'permission_callback' => array( $this, 'check_permission' ),
			),
			array(
				'methods' => WP_REST_Server::CREATABLE,
				'callback' => array( $this, 'create_voucher' ),
				'permission_callback' => array( $this, 'check_permission' ),
			),
		) );
		
		// Invoices Routes
		register_rest_route( $namespace, '/invoices', array(
			array(
				'methods' => WP_REST_Server::READABLE,
				'callback' => array( $this, 'get_invoices' ),
				'permission_callback' => array( $this, 'check_permission' ),
			),
			array(
				'methods' => WP_REST_Server::CREATABLE,
				'callback' => array( $this, 'create_invoice' ),
				'permission_callback' => array( $this, 'check_permission' ),
			),
		) );
		
		// Expenses Routes
		register_rest_route( $namespace, '/expenses', array(
			array(
				'methods' => WP_REST_Server::READABLE,
				'callback' => array( $this, 'get_expenses' ),
				'permission_callback' => array( $this, 'check_permission' ),
			),
			array(
				'methods' => WP_REST_Server::CREATABLE,
				'callback' => array( $this, 'create_expense' ),
				'permission_callback' => array( $this, 'check_permission' ),
			),
		) );
		
		// Food Pass Routes
		register_rest_route( $namespace, '/food-pass', array(
			array(
				'methods' => WP_REST_Server::READABLE,
				'callback' => array( $this, 'get_food_passes' ),
				'permission_callback' => array( $this, 'check_permission' ),
			),
			array(
				'methods' => WP_REST_Server::CREATABLE,
				'callback' => array( $this, 'create_food_pass' ),
				'permission_callback' => array( $this, 'check_permission' ),
			),
		) );
		
		// Addon Routes
		register_rest_route( $namespace, '/addons', array(
			array(
				'methods' => WP_REST_Server::READABLE,
				'callback' => array( $this, 'get_addons' ),
				'permission_callback' => array( $this, 'check_permission' ),
			),
		) );
	}
	
	/**
	 * Check API permission
	 */
	public function check_permission() {
		return current_user_can( 'manage_options' );
	}
	
	// CRM Methods
	public function get_contacts( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'erp_crm_contacts';
		
		// Check if table exists
		if ( ! $this->table_exists( $table ) ) {
			return rest_ensure_response( array() );
		}
		
		$contacts = $wpdb->get_results( "SELECT * FROM $table ORDER BY created_at DESC" );
		return rest_ensure_response( $contacts );
	}
	
	public function create_contact( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'erp_crm_contacts';
		
		// Check if table exists
		if ( ! $this->table_exists( $table ) ) {
			return new WP_Error( 'table_not_found', __( 'Database table not found. Please reactivate the plugin.', 'wp-erp' ), array( 'status' => 500 ) );
		}
		
		$data = $request->get_json_params();
		$result = $wpdb->insert( $table, $data );
		
		if ( $result === false ) {
			return new WP_Error( 'insert_failed', __( 'Failed to create contact.', 'wp-erp' ), array( 'status' => 500 ) );
		}
		
		return rest_ensure_response( array( 'id' => $wpdb->insert_id ) );
	}
	
	public function get_contact( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'erp_crm_contacts';
		if ( ! $this->table_exists( $table ) ) {
			return rest_ensure_response( null );
		}
		$contact = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $table WHERE id = %d", $request['id'] ) );
		return rest_ensure_response( $contact );
	}
	
	public function update_contact( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'erp_crm_contacts';
		if ( ! $this->table_exists( $table ) ) {
			return new WP_Error( 'table_not_found', __( 'Database table not found.', 'wp-erp' ), array( 'status' => 500 ) );
		}
		$data = $request->get_json_params();
		$wpdb->update( $table, $data, array( 'id' => $request['id'] ) );
		return rest_ensure_response( array( 'success' => true ) );
	}
	
	public function delete_contact( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'erp_crm_contacts';
		if ( ! $this->table_exists( $table ) ) {
			return new WP_Error( 'table_not_found', __( 'Database table not found.', 'wp-erp' ), array( 'status' => 500 ) );
		}
		$wpdb->delete( $table, array( 'id' => $request['id'] ) );
		return rest_ensure_response( array( 'success' => true ) );
	}
	
	// Accounting Methods
	public function get_accounts( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'erp_accounting_chart_of_accounts';
		if ( ! $this->table_exists( $table ) ) {
			return rest_ensure_response( array() );
		}
		$accounts = $wpdb->get_results( "SELECT * FROM $table ORDER BY code" );
		return rest_ensure_response( $accounts );
	}
	
	public function get_transactions( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'erp_accounting_transactions';
		if ( ! $this->table_exists( $table ) ) {
			return rest_ensure_response( array() );
		}
		$transactions = $wpdb->get_results( "SELECT * FROM $table ORDER BY date DESC" );
		return rest_ensure_response( $transactions );
	}
	
	public function create_transaction( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'erp_accounting_transactions';
		if ( ! $this->table_exists( $table ) ) {
			return new WP_Error( 'table_not_found', __( 'Database table not found.', 'wp-erp' ), array( 'status' => 500 ) );
		}
		$data = $request->get_json_params();
		$result = $wpdb->insert( $table, $data );
		if ( $result === false ) {
			return new WP_Error( 'insert_failed', __( 'Failed to create transaction.', 'wp-erp' ), array( 'status' => 500 ) );
		}
		return rest_ensure_response( array( 'id' => $wpdb->insert_id ) );
	}
	
	// HR Methods
	public function get_employees( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'erp_hr_employees';
		if ( ! $this->table_exists( $table ) ) {
			return rest_ensure_response( array() );
		}
		$employees = $wpdb->get_results( "SELECT * FROM $table ORDER BY created_at DESC" );
		return rest_ensure_response( $employees );
	}
	
	// Helpdesk Methods
	public function get_tickets( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'erp_helpdesk_tickets';
		if ( ! $this->table_exists( $table ) ) {
			return rest_ensure_response( array() );
		}
		$tickets = $wpdb->get_results( "SELECT * FROM $table ORDER BY created_at DESC" );
		return rest_ensure_response( $tickets );
	}
	
	public function create_ticket( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'erp_helpdesk_tickets';
		if ( ! $this->table_exists( $table ) ) {
			return new WP_Error( 'table_not_found', __( 'Database table not found.', 'wp-erp' ), array( 'status' => 500 ) );
		}
		$data = $request->get_json_params();
		$data['ticket_no'] = 'TKT-' . time();
		$result = $wpdb->insert( $table, $data );
		if ( $result === false ) {
			return new WP_Error( 'insert_failed', __( 'Failed to create ticket.', 'wp-erp' ), array( 'status' => 500 ) );
		}
		return rest_ensure_response( array( 'id' => $wpdb->insert_id ) );
	}
	
	// Vouchers Methods
	public function get_vouchers( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'erp_vouchers';
		if ( ! $this->table_exists( $table ) ) {
			return rest_ensure_response( array() );
		}
		$vouchers = $wpdb->get_results( "SELECT * FROM $table ORDER BY date DESC" );
		return rest_ensure_response( $vouchers );
	}
	
	public function create_voucher( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'erp_vouchers';
		if ( ! $this->table_exists( $table ) ) {
			return new WP_Error( 'table_not_found', __( 'Database table not found.', 'wp-erp' ), array( 'status' => 500 ) );
		}
		$data = $request->get_json_params();
		$data['voucher_no'] = 'VCH-' . time();
		$data['created_by'] = get_current_user_id();
		$result = $wpdb->insert( $table, $data );
		if ( $result === false ) {
			return new WP_Error( 'insert_failed', __( 'Failed to create voucher.', 'wp-erp' ), array( 'status' => 500 ) );
		}
		return rest_ensure_response( array( 'id' => $wpdb->insert_id ) );
	}
	
	// Invoices Methods
	public function get_invoices( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'erp_invoices';
		if ( ! $this->table_exists( $table ) ) {
			return rest_ensure_response( array() );
		}
		$invoices = $wpdb->get_results( "SELECT * FROM $table ORDER BY invoice_date DESC" );
		return rest_ensure_response( $invoices );
	}
	
	public function create_invoice( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'erp_invoices';
		if ( ! $this->table_exists( $table ) ) {
			return new WP_Error( 'table_not_found', __( 'Database table not found.', 'wp-erp' ), array( 'status' => 500 ) );
		}
		$data = $request->get_json_params();
		$data['invoice_no'] = 'INV-' . time();
		$data['created_by'] = get_current_user_id();
		$result = $wpdb->insert( $table, $data );
		if ( $result === false ) {
			return new WP_Error( 'insert_failed', __( 'Failed to create invoice.', 'wp-erp' ), array( 'status' => 500 ) );
		}
		return rest_ensure_response( array( 'id' => $wpdb->insert_id ) );
	}
	
	// Expenses Methods
	public function get_expenses( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'erp_expenses';
		if ( ! $this->table_exists( $table ) ) {
			return rest_ensure_response( array() );
		}
		$expenses = $wpdb->get_results( "SELECT * FROM $table ORDER BY date DESC" );
		return rest_ensure_response( $expenses );
	}
	
	public function create_expense( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'erp_expenses';
		if ( ! $this->table_exists( $table ) ) {
			return new WP_Error( 'table_not_found', __( 'Database table not found.', 'wp-erp' ), array( 'status' => 500 ) );
		}
		$data = $request->get_json_params();
		$data['expense_no'] = 'EXP-' . time();
		$data['created_by'] = get_current_user_id();
		$result = $wpdb->insert( $table, $data );
		if ( $result === false ) {
			return new WP_Error( 'insert_failed', __( 'Failed to create expense.', 'wp-erp' ), array( 'status' => 500 ) );
		}
		return rest_ensure_response( array( 'id' => $wpdb->insert_id ) );
	}
	
	// Food Pass Methods
	public function get_food_passes( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'erp_food_passes';
		if ( ! $this->table_exists( $table ) ) {
			return rest_ensure_response( array() );
		}
		$food_passes = $wpdb->get_results( "SELECT * FROM $table ORDER BY issue_date DESC" );
		return rest_ensure_response( $food_passes );
	}
	
	public function create_food_pass( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'erp_food_passes';
		if ( ! $this->table_exists( $table ) ) {
			return new WP_Error( 'table_not_found', __( 'Database table not found.', 'wp-erp' ), array( 'status' => 500 ) );
		}
		$data = $request->get_json_params();
		$data['pass_no'] = 'FP-' . time();
		$data['created_by'] = get_current_user_id();
		$data['used_meals'] = 0;
		$result = $wpdb->insert( $table, $data );
		if ( $result === false ) {
			return new WP_Error( 'insert_failed', __( 'Failed to create food pass.', 'wp-erp' ), array( 'status' => 500 ) );
		}
		return rest_ensure_response( array( 'id' => $wpdb->insert_id ) );
	}
	
	// Addon Methods
	public function get_addons( $request ) {
		$erp = WP_ERP();
		$addons = $erp->addons->get_addons();
		return rest_ensure_response( $addons );
	}
}

