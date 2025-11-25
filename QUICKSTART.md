# Quick Start Guide

## Installation Steps

### 1. Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install PHP dependencies (optional, for development)
composer install
```

### 2. Build Assets

```bash
# Build for production
npm run build

# Or start development mode with watch
npm start
```

### 3. Activate Plugin

1. Upload the plugin folder to `/wp-content/plugins/`
2. Go to WordPress Admin > Plugins
3. Activate "WP ERP"
4. The plugin will automatically create database tables

### 4. Access Modules

After activation, you'll see new menu items in WordPress admin:
- **CRM** - Contact management
- **Accounting** - Financial management
- **HR** - Human resources
- **Helpdesk** - Ticket management

## Creating Your First Addon

1. Create folder: `/wp-content/wp-erp-addons/my-addon/`
2. Create file: `my-addon.php`

```php
<?php
/**
 * Plugin Name: WP ERP Addon - My Addon
 * Version: 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class WP_ERP_Addon_My_Addon {
    public function __construct() {
        add_action( 'wp_erp_init', array( $this, 'init' ) );
    }
    
    public function init() {
        // Your addon code here
    }
}

new WP_ERP_Addon_My_Addon();
```

3. Go to **WP ERP > Addons** to activate

## Development

### Running Tests

```bash
# JavaScript tests
npm test

# PHP tests (requires WordPress test suite setup)
vendor/bin/phpunit
```

### File Structure

```
wp-erp/
├── wp-erp.php              # Main plugin file
├── includes/               # Core classes
│   ├── class-wp-erp-install.php
│   ├── class-wp-erp-database.php
│   ├── class-wp-erp-module-manager.php
│   ├── class-wp-erp-addon-manager.php
│   ├── class-wp-erp-api.php
│   └── class-wp-erp-admin.php
├── modules/                # Core modules
│   ├── crm/
│   ├── accounting/
│   ├── hr/
│   └── helpdesk/
├── src/                    # React/Gutenberg components
│   ├── index.js
│   └── modules/
├── build/                  # Compiled assets (generated)
├── tests/                  # Test files
└── addons/                 # Example addon
```

## API Usage

All modules expose REST API endpoints:

```javascript
// Fetch contacts
const contacts = await apiFetch({ 
    path: '/wp-erp/v1/crm/contacts' 
});

// Create contact
await apiFetch({
    path: '/wp-erp/v1/crm/contacts',
    method: 'POST',
    data: {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com'
    }
});
```

## Next Steps

- Customize modules to fit your needs
- Create custom addons for specific functionality
- Extend REST API endpoints
- Add custom Gutenberg blocks if needed

