/**
 * Contacts List Component
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Flex, Spinner, Button } from '@wordpress/components';
import { getStatusColor } from '../utils';
import EditModal from '../../../components/EditModal';
import { updateContact } from '../services/api';

const ContactsList = ( { contacts, loading, onContactUpdated } ) => {
	const [ isEditModalOpen, setIsEditModalOpen ] = useState( false );
	const [ editingContact, setEditingContact ] = useState( null );

	const handleEdit = ( contact ) => {
		setEditingContact( contact );
		setIsEditModalOpen( true );
	};

	const handleSave = async ( data ) => {
		try {
			await updateContact( data );
			if ( onContactUpdated ) {
				onContactUpdated();
			}
		} catch ( error ) {
			console.error( error );
		}
	};

	if ( loading ) {
		return (
			<Flex justify="center" style={ { padding: '32px' } }>
				<Spinner />
			</Flex>
		);
	}

	if ( contacts.length === 0 ) {
		return (
			<p
				style={ {
					padding: '16px',
					textAlign: 'center',
					color: '#757575',
				} }
			>
				{ __( 'No contacts found.', 'wp-erp' ) }
			</p>
		);
	}

	const contactFields = [
		{ key: 'first_name', label: __( 'First Name', 'wp-erp' ), type: 'text' },
		{ key: 'last_name', label: __( 'Last Name', 'wp-erp' ), type: 'text' },
		{ key: 'email', label: __( 'Email', 'wp-erp' ), type: 'text', inputType: 'email' },
		{ key: 'phone', label: __( 'Phone', 'wp-erp' ), type: 'text', inputType: 'tel' },
		{ key: 'company', label: __( 'Company', 'wp-erp' ), type: 'text' },
		{
			key: 'status',
			label: __( 'Status', 'wp-erp' ),
			type: 'select',
			options: [
				{ label: 'Lead', value: 'lead' },
				{ label: 'Customer', value: 'customer' },
				{ label: 'Opportunity', value: 'opportunity' },
			],
		},
		{ key: 'address_line_1', label: __( 'Address Line 1', 'wp-erp' ), type: 'text' },
		{ key: 'address_line_2', label: __( 'Address Line 2', 'wp-erp' ), type: 'text' },
		{ key: 'city', label: __( 'City', 'wp-erp' ), type: 'text' },
		{ key: 'state', label: __( 'State', 'wp-erp' ), type: 'text' },
		{ key: 'postal_code', label: __( 'Postal Code', 'wp-erp' ), type: 'text' },
		{ key: 'country', label: __( 'Country', 'wp-erp' ), type: 'text' },
		{ key: 'birthday', label: __( 'Birthday', 'wp-erp' ), type: 'text', inputType: 'date' },
		{ key: 'anniversary', label: __( 'Anniversary', 'wp-erp' ), type: 'text', inputType: 'date' },
	];

	return (
		<div style={ { overflowX: 'auto' } }>
			<table className="wp-list-table widefat fixed striped">
				<thead>
					<tr>
						<th>{ __( 'ID', 'wp-erp' ) }</th>
						<th>{ __( 'Name', 'wp-erp' ) }</th>
						<th>{ __( 'Email', 'wp-erp' ) }</th>
						<th>{ __( 'Phone', 'wp-erp' ) }</th>
						<th>{ __( 'Company', 'wp-erp' ) }</th>
						<th>{ __( 'Status', 'wp-erp' ) }</th>
						<th>{ __( 'Actions', 'wp-erp' ) }</th>
					</tr>
				</thead>
				<tbody>
					{ contacts.map( ( contact ) => (
						<tr key={ contact.id }>
							<td>{ contact.id }</td>
							<td>
								<strong>
									{ contact.first_name }{ ' ' }
									{ contact.last_name }
								</strong>
							</td>
							<td>{ contact.email || '-' }</td>
							<td>{ contact.phone || '-' }</td>
							<td>{ contact.company || '-' }</td>
							<td>
								<span
									style={ {
										padding: '4px 8px',
										borderRadius: '2px',
										backgroundColor: getStatusColor(
											contact.status
										),
										color: '#fff',
										fontSize: '12px',
										textTransform: 'capitalize',
									} }
								>
									{ contact.status }
								</span>
							</td>
							<td>
								<Button
									isSmall
									variant="secondary"
									onClick={ () => handleEdit( contact ) }
								>
									{ __( 'Edit', 'wp-erp' ) }
								</Button>
							</td>
						</tr>
					) ) }
				</tbody>
			</table>

			<EditModal
				title={ __( 'Edit Contact', 'wp-erp' ) }
				isOpen={ isEditModalOpen }
				onClose={ () => setIsEditModalOpen( false ) }
				onSave={ handleSave }
				data={ editingContact }
				fields={ contactFields }
			/>
		</div>
	);
};

export default ContactsList;
