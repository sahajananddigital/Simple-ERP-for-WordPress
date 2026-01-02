<?php
/**
 * CRM API Controller
 *
 * @package Gurukul_ERP
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/class-wp-erp-api-controller.php';

class WP_ERP_API_CRM extends WP_ERP_API_Controller {

	/**
	 * Register routes
	 */
	public function register_routes() {
		register_rest_route( $this->namespace, '/crm/contacts', array(
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
		
		register_rest_route( $this->namespace, '/crm/contacts/(?P<id>\d+)', array(
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
	}

	/**
	 * Get Contacts
	 */
	public function get_contacts( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'erp_crm_contacts';
		
		$params = $request->get_params();
		$where = array( '1=1' );
		$args = array();

		// Status
		if ( ! empty( $params['status'] ) && $params['status'] !== 'all' ) {
			$where[] = 'status = %s';
			$args[] = sanitize_text_field( $params['status'] );
		}

		// Type (Student, Guardian, Teacher)
		if ( ! empty( $params['type'] ) && $params['type'] !== 'all' ) {
			$where[] = 'type = %s';
			$args[] = sanitize_text_field( $params['type'] );
		}

		// Search (Name/Email/Phone)
		if ( ! empty( $params['search'] ) ) {
			$search = '%' . $wpdb->esc_like( sanitize_text_field( $params['search'] ) ) . '%';
			$where[] = '(first_name LIKE %s OR last_name LIKE %s OR email LIKE %s OR phone LIKE %s)';
			$args[] = $search;
			$args[] = $search;
			$args[] = $search;
			$args[] = $search;
		}

		$where_sql = implode( ' AND ', $where );
		
		if ( ! empty( $args ) ) {
			$sql = $wpdb->prepare( "SELECT * FROM $table WHERE $where_sql ORDER BY created_at DESC", $args );
		} else {
			$sql = "SELECT * FROM $table WHERE $where_sql ORDER BY created_at DESC";
		}
		
		$contacts = $wpdb->get_results( $sql );

        // Set Cache Headers based on latest item
        if ( ! empty( $contacts ) ) {
            $latest = $contacts[0]->updated_at ?? $contacts[0]->created_at; // Assuming updated_at exists or using create
            // If updated_at is missing from schema, create fallback
            $this->set_cache_headers( $latest );
        }

		return rest_ensure_response( $contacts );
	}

	/**
	 * Create Contact
	 */
	public function create_contact( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'erp_crm_contacts';
		
		$data = $request->get_json_params();
        
        // Validation could go here
        
		$result = $wpdb->insert( $table, $data );
		
		if ( $result === false ) {
			return new WP_Error( 'insert_failed', __( 'Failed to create contact.', 'wp-erp' ), array( 'status' => 500 ) );
		}
		
		return rest_ensure_response( array( 'id' => $wpdb->insert_id ) );
	}

	/**
	 * Get Single Contact
	 */
	public function get_contact( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'erp_crm_contacts';
		$contact = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $table WHERE id = %d", $request['id'] ) );
        
        if ( $contact ) {
             $this->set_cache_headers( $contact->updated_at ?? $contact->created_at );
        }
        
		return rest_ensure_response( $contact );
	}

	/**
	 * Update Contact
	 */
	public function update_contact( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'erp_crm_contacts';
		$data = $request->get_json_params();
		$wpdb->update( $table, $data, array( 'id' => $request['id'] ) );
		return rest_ensure_response( array( 'success' => true ) );
	}

	/**
	 * Delete Contact
	 */
	public function delete_contact( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'erp_crm_contacts';
		$wpdb->delete( $table, array( 'id' => $request['id'] ) );
		return rest_ensure_response( array( 'success' => true ) );
	}
}
