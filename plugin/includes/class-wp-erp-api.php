<?php
/**
 * REST API Handler
 *
 * @package Gurukul_ERP
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once __DIR__ . '/api/class-wp-erp-api-crm.php';
require_once __DIR__ . '/api/class-wp-erp-api-donations.php';
require_once __DIR__ . '/api/class-wp-erp-api-food-pass.php';
require_once __DIR__ . '/api/class-wp-erp-api-general.php';
require_once __DIR__ . '/api/class-wp-erp-api-content.php';
require_once __DIR__ . '/api/class-wp-erp-api-quotes.php';
require_once __DIR__ . '/api/class-wp-erp-api-updates.php';
require_once __DIR__ . '/api/class-wp-erp-api-satsang.php';
require_once __DIR__ . '/api/class-wp-erp-api-programs.php';
require_once __DIR__ . '/api/class-wp-erp-api-calendar.php';

class WP_ERP_API {
    
    /**
     * Initialize API
     */
    public function __construct() {
        add_action( 'rest_api_init', array( $this, 'register_routes' ) );
    }

    /**
     * Register REST API routes
     */
    public function register_routes() {
        $general = new WP_ERP_API_General();
        $general->register_routes();

        $crm = new WP_ERP_API_CRM();
        $crm->register_routes();

        $food_pass = new WP_ERP_API_Food_Pass();
        $food_pass->register_routes();

        $donations = new WP_ERP_API_Donations();
        $donations->register_routes();
        
        $content = new WP_ERP_API_Content();
        $content->register_routes();

        $quotes = new WP_ERP_API_Quotes();
        $quotes->register_routes();

        $updates = new WP_ERP_API_Updates();
        $updates->register_routes();

        $satsang = new WP_ERP_API_Satsang();
        $satsang->register_routes();
        
        $programs = new WP_ERP_API_Programs();
        $programs->register_routes();

        $calendar = new WP_ERP_API_Calendar();
        $calendar->register_routes();
    }
}
