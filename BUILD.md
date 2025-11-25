# Building WP ERP Plugin

## Quick Build Instructions

The plugin requires building JavaScript assets before use. Follow these steps:

### 1. Install Dependencies

```bash
cd "/Users/multidots/Documents/GitHub/ERP for WordPress"
npm install
```

### 2. Build Assets

```bash
# Production build
npm run build

# OR Development build with watch mode
npm start
```

### 3. Verify Build

After building, you should see:
- `build/index.js` - Main JavaScript bundle
- `build/style.css` - Stylesheet

## Troubleshooting

### Page Not Rendering

If the page doesn't render:

1. **Check if build files exist:**
   ```bash
   ls -la build/
   ```

2. **If build directory is missing, run:**
   ```bash
   npm install
   npm run build
   ```

3. **Check browser console for errors:**
   - Open browser DevTools (F12)
   - Check Console tab for JavaScript errors
   - Check Network tab to see if `build/index.js` is loading

4. **Clear WordPress cache:**
   - Deactivate and reactivate the plugin
   - Clear browser cache
   - Clear any caching plugins

### Common Issues

**Error: "Build files are missing"**
- Solution: Run `npm install` and `npm run build`

**Error: "Cannot find module"**
- Solution: Make sure all dependencies are installed with `npm install`

**Error: "wp-element is not defined"**
- Solution: Make sure WordPress is up to date (5.8+) and Gutenberg is active

**Page loads but React components don't render**
- Check browser console for errors
- Verify the root div elements exist in the PHP templates
- Check that script is enqueued correctly

## Development Mode

For development, use watch mode:

```bash
npm start
```

This will:
- Watch for file changes
- Automatically rebuild on save
- Provide source maps for debugging

## Production Build

For production:

```bash
npm run build
```

This creates optimized, minified files in the `build/` directory.

