module.exports = {
	extends: ['plugin:@wordpress/eslint-plugin/recommended'],
	env: {
		browser: true,
		es6: true,
		node: true,
	},
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
		},
	},
	rules: {
		'@wordpress/no-unsafe-wp-apis': 'warn',
	},
};

