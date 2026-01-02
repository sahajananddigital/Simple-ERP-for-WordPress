# Debugging WP ERP Critical Error

## Steps to Fix

1. **Deactivate the plugin** (via FTP or rename the folder if needed)
   - Rename `/wp-content/plugins/wp-erp/` to `/wp-content/plugins/wp-erp-disabled/`

2. **Check WordPress error logs**
   - Look in `/wp-content/debug.log` (if WP_DEBUG is enabled)
   - Check server error logs

3. **Reactivate the plugin**
   - Rename back to `wp-erp`
   - Go to Plugins and activate
   - This will run the installation/table creation

4. **Check if tables were created**
   - Use phpMyAdmin or database tool
   - Look for tables starting with `wp_erp_`

5. **Enable WordPress Debug Mode**
   Add to `wp-config.php`:
   ```php
   define( 'WP_DEBUG', true );
   define( 'WP_DEBUG_LOG', true );
   define( 'WP_DEBUG_DISPLAY', false );
   ```

6. **Common Issues Fixed:**
   - ✅ Added table existence checks before database queries
   - ✅ Added error handling for missing build files
   - ✅ Added safety checks for module initialization
   - ✅ Fixed potential null reference errors

## If Still Having Issues

Check the browser console and WordPress debug log for specific error messages.

