/**
 * HR Module App
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
	TabPanel,
} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

const HRApp = ( { view = 'employees' } ) => {
	const [ employees, setEmployees ] = useState( [] );
	const [ loading, setLoading ] = useState( true );
	const [ error, setError ] = useState( null );
	const [ activeTab, setActiveTab ] = useState( view );

	useEffect( () => {
		if ( activeTab === 'employees' ) {
			fetchEmployees();
		}
	}, [ activeTab ] );

	const fetchEmployees = async () => {
		setLoading( true );
		setError( null );
		try {
			const data = await apiFetch( { path: '/wp-erp/v1/hr/employees' } );
			setEmployees( data );
		} catch ( err ) {
			setError(
				err.message || __( 'Failed to fetch employees', 'wp-erp' )
			);
		} finally {
			setLoading( false );
		}
	};

	const getStatusColor = ( status ) => {
		switch ( status ) {
			case 'active':
				return '#00a32a';
			default:
				return '#757575';
		}
	};

	const renderEmployeesList = () => {
		if ( loading ) {
			return (
				<Flex justify="center" style={ { padding: '32px' } }>
					<Spinner />
				</Flex>
			);
		}

		if ( employees.length === 0 ) {
			return (
				<p
					style={ {
						padding: '16px',
						textAlign: 'center',
						color: '#757575',
					} }
				>
					{ __( 'No employees found.', 'wp-erp' ) }
				</p>
			);
		}

		return (
			<div style={ { overflowX: 'auto' } }>
				<table className="wp-list-table widefat fixed striped">
					<thead>
						<tr>
							<th>{ __( 'Employee ID', 'wp-erp' ) }</th>
							<th>{ __( 'Name', 'wp-erp' ) }</th>
							<th>{ __( 'Designation', 'wp-erp' ) }</th>
							<th>{ __( 'Department', 'wp-erp' ) }</th>
							<th>{ __( 'Status', 'wp-erp' ) }</th>
						</tr>
					</thead>
					<tbody>
						{ employees.map( ( employee ) => (
							<tr key={ employee.id }>
								<td>
									<strong>{ employee.employee_id }</strong>
								</td>
								<td>
									{ employee.user_id
										? `User #${ employee.user_id }`
										: '-' }
								</td>
								<td>{ employee.designation || '-' }</td>
								<td>{ employee.department || '-' }</td>
								<td>
									<span
										style={ {
											padding: '4px 8px',
											borderRadius: '2px',
											backgroundColor: getStatusColor(
												employee.status
											),
											color: '#fff',
											fontSize: '12px',
											textTransform: 'capitalize',
										} }
									>
										{ employee.status }
									</span>
								</td>
							</tr>
						) ) }
					</tbody>
				</table>
			</div>
		);
	};

	const renderLeaveRequests = () => {
		return (
			<div className="wp-erp-hr">
				<Card>
					<CardHeader>
						<h2 style={ { margin: 0 } }>
							{ __( 'Leave Requests', 'wp-erp' ) }
						</h2>
					</CardHeader>
					<CardBody>
						<p
							style={ {
								padding: '16px',
								textAlign: 'center',
								color: '#757575',
							} }
						>
							{ __( 'Leave management coming soon…', 'wp-erp' ) }
						</p>
					</CardBody>
				</Card>
			</div>
		);
	};

	return (
		<div className="wp-erp-hr" style={ { padding: '16px' } }>
			{ error && (
				<Notice
					status="error"
					isDismissible={ false }
					onRemove={ () => setError( null ) }
				>
					{ error }
				</Notice>
			) }

			<Card>
				<CardHeader>
					<h2 style={ { margin: 0 } }>
						{ __( 'HR Management', 'wp-erp' ) }
					</h2>
				</CardHeader>
				<CardBody>
					<TabPanel
						className="wp-erp-hr-tabs"
						activeClass="is-active"
						initialTabName={ activeTab }
						onSelect={ ( tabName ) => setActiveTab( tabName ) }
						tabs={ [
							{
								name: 'employees',
								title: __( 'Employees', 'wp-erp' ),
								className: 'tab-employees',
							},
							{
								name: 'leaves',
								title: __( 'Leave Requests', 'wp-erp' ),
								className: 'tab-leaves',
							},
						] }
					>
						{ ( tab ) => {
							if ( tab.name === 'employees' ) {
								return renderEmployeesList();
							}
							return renderLeaveRequests();
						} }
					</TabPanel>
				</CardBody>
			</Card>
		</div>
	);
};

export default HRApp;
