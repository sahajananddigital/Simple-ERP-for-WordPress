/**
 * WordPress ERP Plugin - Main Entry Point
 */
import { createRoot } from 'react-dom/client';

// Import modules
import CRMApp from './modules/crm/App';
import AccountingApp from './modules/accounting/App';
import HRApp from './modules/hr/App';
import HelpdeskApp from './modules/helpdesk/App';
import VouchersApp from './modules/vouchers/App';
import InvoicesApp from './modules/invoices/App';
import ExpensesApp from './modules/expenses/App';
import FoodPassApp from './modules/food-pass/App';

// Initialize modules based on page
function initERP() {
	// CRM
	const crmRoot = document.getElementById( 'wp-erp-crm-root' );
	if ( crmRoot ) {
		const root = createRoot( crmRoot );
		root.render( <CRMApp /> );
	}

	// Accounting
	const accountingRoot = document.getElementById( 'wp-erp-accounting-root' );
	if ( accountingRoot ) {
		const root = createRoot( accountingRoot );
		root.render( <AccountingApp /> );
	}

	const accountingTransactionsRoot = document.getElementById( 'wp-erp-accounting-transactions-root' );
	if ( accountingTransactionsRoot ) {
		const root = createRoot( accountingTransactionsRoot );
		root.render( <AccountingApp view="transactions" /> );
	}

	// HR
	const hrRoot = document.getElementById( 'wp-erp-hr-root' );
	if ( hrRoot ) {
		const root = createRoot( hrRoot );
		root.render( <HRApp /> );
	}

	const hrLeavesRoot = document.getElementById( 'wp-erp-hr-leaves-root' );
	if ( hrLeavesRoot ) {
		const root = createRoot( hrLeavesRoot );
		root.render( <HRApp view="leaves" /> );
	}

	// Helpdesk
	const helpdeskRoot = document.getElementById( 'wp-erp-helpdesk-root' );
	if ( helpdeskRoot ) {
		const root = createRoot( helpdeskRoot );
		root.render( <HelpdeskApp /> );
	}

	// Vouchers
	const vouchersRoot = document.getElementById( 'wp-erp-vouchers-root' );
	if ( vouchersRoot ) {
		const root = createRoot( vouchersRoot );
		root.render( <VouchersApp /> );
	}

	const vouchersCreateRoot = document.getElementById( 'wp-erp-vouchers-create-root' );
	if ( vouchersCreateRoot ) {
		const root = createRoot( vouchersCreateRoot );
		root.render( <VouchersApp view="create" /> );
	}

	// Invoices
	const invoicesRoot = document.getElementById( 'wp-erp-invoices-root' );
	if ( invoicesRoot ) {
		const root = createRoot( invoicesRoot );
		root.render( <InvoicesApp /> );
	}

	const invoicesCreateRoot = document.getElementById( 'wp-erp-invoices-create-root' );
	if ( invoicesCreateRoot ) {
		const root = createRoot( invoicesCreateRoot );
		root.render( <InvoicesApp view="create" /> );
	}

	// Expenses
	const expensesRoot = document.getElementById( 'wp-erp-expenses-root' );
	if ( expensesRoot ) {
		const root = createRoot( expensesRoot );
		root.render( <ExpensesApp /> );
	}

	const expensesCreateRoot = document.getElementById( 'wp-erp-expenses-create-root' );
	if ( expensesCreateRoot ) {
		const root = createRoot( expensesCreateRoot );
		root.render( <ExpensesApp view="create" /> );
	}

	// Food Pass
	const foodPassRoot = document.getElementById( 'wp-erp-food-pass-root' );
	if ( foodPassRoot ) {
		const root = createRoot( foodPassRoot );
		root.render( <FoodPassApp /> );
	}

	const foodPassCreateRoot = document.getElementById( 'wp-erp-food-pass-create-root' );
	if ( foodPassCreateRoot ) {
		const root = createRoot( foodPassCreateRoot );
		root.render( <FoodPassApp view="create" /> );
	}
}

// Wait for DOM to be ready
if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', initERP );
} else {
	// DOM is already ready
	initERP();
}

