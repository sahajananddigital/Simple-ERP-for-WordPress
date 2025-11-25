/**
 * Accounting Module App
 */
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	Card,
	CardBody,
	CardHeader,
	Spinner,
	Notice,
	Flex,
} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

const AccountingApp = ({ view = 'accounts' }) => {
	const [accounts, setAccounts] = useState([]);
	const [transactions, setTransactions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (view === 'accounts') {
			fetchAccounts();
		} else {
			fetchTransactions();
		}
	}, [view]);

	const fetchAccounts = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await apiFetch({ path: '/wp-erp/v1/accounting/accounts' });
			setAccounts(data);
		} catch (err) {
			setError(err.message || __('Failed to fetch accounts', 'wp-erp'));
		} finally {
			setLoading(false);
		}
	};

	const fetchTransactions = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await apiFetch({ path: '/wp-erp/v1/accounting/transactions' });
			setTransactions(data);
		} catch (err) {
			setError(err.message || __('Failed to fetch transactions', 'wp-erp'));
		} finally {
			setLoading(false);
		}
	};

	if (view === 'transactions') {
		return (
			<div className="wp-erp-accounting" style={{ padding: '16px' }}>
				{error && (
					<Notice status="error" isDismissible={false} onRemove={() => setError(null)}>
						{error}
					</Notice>
				)}

				<Card>
					<CardHeader>
						<h2 style={{ margin: 0 }}>{__('Transactions', 'wp-erp')}</h2>
					</CardHeader>
					<CardBody>
						{loading ? (
							<Flex justify="center" style={{ padding: '32px' }}>
								<Spinner />
							</Flex>
						) : transactions.length === 0 ? (
							<p style={{ padding: '16px', textAlign: 'center', color: '#757575' }}>
								{__('No transactions found.', 'wp-erp')}
							</p>
						) : (
							<div style={{ overflowX: 'auto' }}>
								<table className="wp-list-table widefat fixed striped">
									<thead>
										<tr>
											<th>{__('Voucher No', 'wp-erp')}</th>
											<th>{__('Type', 'wp-erp')}</th>
											<th>{__('Date', 'wp-erp')}</th>
											<th>{__('Reference', 'wp-erp')}</th>
											<th>{__('Total', 'wp-erp')}</th>
										</tr>
									</thead>
									<tbody>
										{transactions.map((transaction) => (
											<tr key={transaction.id}>
												<td><strong>{transaction.voucher_no}</strong></td>
												<td>{transaction.type}</td>
												<td>{transaction.date}</td>
												<td>{transaction.reference || '-'}</td>
												<td><strong>{transaction.total}</strong></td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</CardBody>
				</Card>
			</div>
		);
	}

	return (
		<div className="wp-erp-accounting" style={{ padding: '16px' }}>
			{error && (
				<Notice status="error" isDismissible={false} onRemove={() => setError(null)}>
					{error}
				</Notice>
			)}

			<Card>
				<CardHeader>
					<h2 style={{ margin: 0 }}>{__('Chart of Accounts', 'wp-erp')}</h2>
				</CardHeader>
				<CardBody>
					{loading ? (
						<Flex justify="center" style={{ padding: '32px' }}>
							<Spinner />
						</Flex>
					) : accounts.length === 0 ? (
						<p style={{ padding: '16px', textAlign: 'center', color: '#757575' }}>
							{__('No accounts found.', 'wp-erp')}
						</p>
					) : (
						<div style={{ overflowX: 'auto' }}>
							<table className="wp-list-table widefat fixed striped">
								<thead>
									<tr>
										<th>{__('Code', 'wp-erp')}</th>
										<th>{__('Name', 'wp-erp')}</th>
										<th>{__('Type', 'wp-erp')}</th>
										<th>{__('Balance', 'wp-erp')}</th>
									</tr>
								</thead>
								<tbody>
									{accounts.map((account) => (
										<tr key={account.id}>
											<td><strong>{account.code}</strong></td>
											<td>{account.name}</td>
											<td>{account.type}</td>
											<td><strong>{account.balance}</strong></td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</CardBody>
			</Card>
		</div>
	);
};

export default AccountingApp;

