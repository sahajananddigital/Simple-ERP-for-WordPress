# WP ERP - WordPress ERP Plugin

A comprehensive ERP solution for WordPress with extensible addon support. Includes CRM, Accounting, HR, and Helpdesk modules built with Gutenberg native UI.

## Features

- **Modular Architecture**: Extensible plugin structure for custom addons
- **Gutenberg UI**: Native WordPress Gutenberg components for modern interface
- **Core Modules**:
  - **CRM**: Contact management, lead tracking, customer relationships
  - **Accounting**: Chart of accounts, transactions, billing
  - **HR**: Employee management, leave requests
  - **Helpdesk**: Ticket management system
- **REST API**: Full REST API for all modules
- **Addon System**: Easy to create and install custom extensions
- **Testing**: Includes PHPUnit and Jest tests

## Installation

1. Upload the plugin to `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. The plugin will automatically create necessary database tables

## Development Setup

### Prerequisites

- Node.js 16+ and npm
- PHP 7.4+
- WordPress 5.8+
- Composer (for PHP dependencies)

### Install Dependencies

```bash
npm install
```

### Build Assets

```bash
# Development build with watch mode
npm start

# Production build
npm run build
```

### Running Tests

```bash
# JavaScript tests
npm test

# PHP tests (requires WordPress test suite)
vendor/bin/phpunit
```

## Creating Addons

Addons can be installed in `/wp-content/wp-erp-addons/` directory. Each addon should follow this structure:

```
wp-erp-addons/
  your-addon/
    your-addon.php
    package.json (optional)
    src/ (optional)
```

### Example Addon

```php
<?php
/**
 * Plugin Name: WP ERP Addon - Your Addon
 * Description: Custom addon for WP ERP
 * Version: 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class WP_ERP_Addon_Your_Addon {
    
    public function __construct() {
        add_action( 'wp_erp_init', array( $this, 'init' ) );
    }
    
    public function init() {
        // Your addon initialization code
    }
}

new WP_ERP_Addon_Your_Addon();
```

## API Endpoints

### CRM
- `GET /wp-erp/v1/crm/contacts` - Get all contacts
- `POST /wp-erp/v1/crm/contacts` - Create contact
- `GET /wp-erp/v1/crm/contacts/{id}` - Get contact
- `PUT /wp-erp/v1/crm/contacts/{id}` - Update contact
- `DELETE /wp-erp/v1/crm/contacts/{id}` - Delete contact

### Accounting
- `GET /wp-erp/v1/accounting/accounts` - Get chart of accounts
- `GET /wp-erp/v1/accounting/transactions` - Get transactions
- `POST /wp-erp/v1/accounting/transactions` - Create transaction

### HR
- `GET /wp-erp/v1/hr/employees` - Get employees

### Helpdesk
- `GET /wp-erp/v1/helpdesk/tickets` - Get tickets
- `POST /wp-erp/v1/helpdesk/tickets` - Create ticket

## Database Schema

The plugin creates the following tables:
- `wp_erp_crm_contacts` - CRM contacts
- `wp_erp_crm_activities` - CRM activities
- `wp_erp_accounting_chart_of_accounts` - Chart of accounts
- `wp_erp_accounting_transactions` - Accounting transactions
- `wp_erp_accounting_transaction_entries` - Transaction entries
- `wp_erp_hr_employees` - HR employees
- `wp_erp_hr_leave_requests` - Leave requests
- `wp_erp_helpdesk_tickets` - Helpdesk tickets
- `wp_erp_helpdesk_ticket_replies` - Ticket replies
- `wp_erp_addons` - Installed addons

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

GPL v2 or later

## Credits

Inspired by ERPNext - an open-source ERP system.

