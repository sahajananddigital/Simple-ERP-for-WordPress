<?php
/**
 * Donations API Controller
 *
 * @package Gurukul_ERP
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/class-wp-erp-api-controller.php';

class WP_ERP_API_Donations extends WP_ERP_API_Controller {

	/**
	 * Register routes
	 */
	public function register_routes() {
		register_rest_route( $this->namespace, '/donations', array(
			array(
				'methods' => WP_REST_Server::READABLE,
				'callback' => array( $this, 'get_donations' ),
				'permission_callback' => array( $this, 'check_permission' ),
			),
			array(
				'methods' => WP_REST_Server::CREATABLE,
				'callback' => array( $this, 'create_donation' ),
				'permission_callback' => array( $this, 'check_permission' ),
			),
		) );
	}

	/**
	 * Get Donations
	 */
	public function get_donations( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'erp_donations'; // Assuming table name
        
        // If table doesn't exist, handle or check inside get_results is risky if not suppressed
        // We assume schema exists as per user statement
        
		$donations = $wpdb->get_results( "SELECT * FROM $table ORDER BY created_at DESC" );
        
        if ( ! empty( $donations ) ) {
             $this->set_cache_headers( $donations[0]->created_at );
        }
        
		return rest_ensure_response( $donations );
	}

	/**
	 * Create Donation
	 */
	public function create_donation( $request ) {
		global $wpdb;
		$table = $wpdb->prefix . 'erp_donations';
		
		$data = $request->get_json_params();
        $data['created_by'] = get_current_user_id();
        
		$result = $wpdb->insert( $table, $data );
		
		if ( $result === false ) {
			return new WP_Error( 'insert_failed', __( 'Failed to create donation.', 'wp-erp' ), array( 'status' => 500 ) );
		}
		
		return rest_ensure_response( array( 'id' => $wpdb->insert_id ) );
	}
}
