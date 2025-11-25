# Testing Guide

## Test Coverage

### JavaScript/React Tests (Jest)
All module components have comprehensive test coverage:

- ✅ **CRM Module** - 3 tests
- ✅ **Accounting Module** - 3 tests  
- ✅ **HR Module** - 3 tests
- ✅ **Helpdesk Module** - 3 tests
- ✅ **Vouchers Module** - 3 tests
- ✅ **Invoices Module** - 3 tests
- ✅ **Expenses Module** - 3 tests
- ✅ **Food Pass Module** - 3 tests

**Total: 24 tests, all passing**

### PHP Tests (PHPUnit)
Backend tests cover:

- ✅ Plugin activation
- ✅ Database table creation (all 17 tables)
- ✅ Module registration (all 8 modules)
- ✅ CRM API functionality
- ✅ Vouchers API functionality
- ✅ Invoices API functionality
- ✅ Expenses API functionality
- ✅ Food Pass API functionality
- ✅ REST API route registration
- ✅ Addon manager

## Running Tests

### JavaScript Tests
```bash
npm test
```

### Watch Mode (for development)
```bash
npm run test:watch
```

### PHP Tests
```bash
# Requires WordPress test suite setup
vendor/bin/phpunit
```

## Test Structure

### JavaScript Tests
Located in `tests/modules/` directory:
- Each module has its own test file: `App.test.js`
- Tests cover:
  - Component rendering
  - Data fetching and display
  - Form rendering (for create views)
  - Error handling

### PHP Tests
Located in `tests/php/` directory:
- Main test file: `class-wp-erp-test.php`
- Tests cover:
  - Database operations
  - Module registration
  - API endpoints
  - Data persistence

## Test Setup

### Jest Configuration
- Uses `jest.config.js` for configuration
- Setup file: `tests/setup.js`
- Mocks WordPress globals and `window.matchMedia`

### PHPUnit Configuration
- Uses `phpunit.xml` for configuration
- Bootstrap file: `tests/php/bootstrap.php`
- Requires WordPress test suite

## Writing New Tests

### Adding JavaScript Tests
1. Create test file in `tests/modules/[module-name]/App.test.js`
2. Import the component and testing utilities
3. Mock `@wordpress/api-fetch`
4. Write tests for rendering, data fetching, and error handling

### Adding PHP Tests
1. Add test methods to `tests/php/class-wp-erp-test.php`
2. Use WordPress test utilities (`WP_UnitTestCase`)
3. Test database operations and API functionality

## Test Best Practices

1. **Isolation**: Each test should be independent
2. **Mocking**: Mock external dependencies (API calls, WordPress functions)
3. **Coverage**: Test both success and error scenarios
4. **Clarity**: Use descriptive test names
5. **Speed**: Keep tests fast and focused

