/**
 * Jest configuration for WordPress ERP
 */
module.exports = {
	testEnvironment: 'jsdom',
	setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
	moduleNameMapper: {
		'^@wordpress/(.*)$': '<rootDir>/node_modules/@wordpress/$1',
	},
	transform: {
		'^.+\\.jsx?$': 'babel-jest',
	},
	testMatch: ['**/tests/**/*.test.js', '**/tests/**/*.test.jsx'],
	collectCoverageFrom: [
		'src/**/*.{js,jsx}',
		'!src/**/*.test.{js,jsx}',
	],
};

