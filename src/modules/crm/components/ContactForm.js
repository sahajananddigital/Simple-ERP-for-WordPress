/**
 * Contact Form Component
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	Card,
	CardBody,
	CardHeader,
	Button,
	TextControl,
	SelectControl,
	Flex,
	FlexBlock,
	Notice,
} from '@wordpress/components';
import { createContact } from '../services/api';

const ContactForm = ( { onContactCreated } ) => {
	const [ isCreating, setIsCreating ] = useState( false );
	const [ error, setError ] = useState( null );
	const [ formData, setFormData ] = useState( {
		first_name: '',
		last_name: '',
		email: '',
		phone: '',
		company: '',
		status: 'lead',
		type: 'contact',
	} );

	const handleSubmit = async ( e ) => {
		e.preventDefault();
		setIsCreating( true );
		setError( null );

		try {
			await createContact( formData );
			
			// Reset form
			setFormData( {
				first_name: '',
				last_name: '',
				email: '',
				phone: '',
				company: '',
				status: 'lead',
				type: 'contact',
			} );

			if ( onContactCreated ) {
				onContactCreated();
			}
		} catch ( err ) {
			setError( err.message );
		} finally {
			setIsCreating( false );
		}
	};

	return (
		<>
			{ error && (
				<Notice
					status="error"
					isDismissible={ false }
					onRemove={ () => setError( null ) }
				>
					{ error }
				</Notice>
			) }
			<Card style={ { marginBottom: '24px' } }>
				<CardHeader>
					<h2 style={ { margin: 0 } }>
						{ __( 'Add New Contact', 'wp-erp' ) }
					</h2>
				</CardHeader>
				<CardBody>
					<form onSubmit={ handleSubmit }>
						<Flex direction="column" gap={ 4 }>
							<Flex>
								<FlexBlock>
									<TextControl
										label={ __(
											'First Name',
											'wp-erp'
										) }
										value={ formData.first_name }
										onChange={ ( value ) =>
											setFormData( {
												...formData,
												first_name: value,
											} )
										}
										required
									/>
								</FlexBlock>
								<FlexBlock>
									<TextControl
										label={ __(
											'Last Name',
											'wp-erp'
										) }
										value={ formData.last_name }
										onChange={ ( value ) =>
											setFormData( {
												...formData,
												last_name: value,
											} )
										}
										required
									/>
								</FlexBlock>
							</Flex>
							<Flex>
								<FlexBlock>
									<TextControl
										label={ __( 'Email', 'wp-erp' ) }
										type="email"
										value={ formData.email }
										onChange={ ( value ) =>
											setFormData( {
												...formData,
												email: value,
											} )
										}
									/>
								</FlexBlock>
								<FlexBlock>
									<TextControl
										label={ __( 'Phone', 'wp-erp' ) }
										value={ formData.phone }
										onChange={ ( value ) =>
											setFormData( {
												...formData,
												phone: value,
											} )
										}
									/>
								</FlexBlock>
							</Flex>
							<Flex>
								<FlexBlock>
									<TextControl
										label={ __( 'Company', 'wp-erp' ) }
										value={ formData.company }
										onChange={ ( value ) =>
											setFormData( {
												...formData,
												company: value,
											} )
										}
									/>
								</FlexBlock>
								<FlexBlock>
									<SelectControl
										label={ __( 'Status', 'wp-erp' ) }
										value={ formData.status }
										options={ [
											{
												label: __(
													'Lead',
													'wp-erp'
												),
												value: 'lead',
											},
											{
												label: __(
													'Customer',
													'wp-erp'
												),
												value: 'customer',
											},
											{
												label: __(
													'Opportunity',
													'wp-erp'
												),
												value: 'opportunity',
											},
										] }
										onChange={ ( value ) =>
											setFormData( {
												...formData,
												status: value,
											} )
										}
									/>
								</FlexBlock>
							</Flex>
							<Flex justify="flex-start">
								<Button
									variant="primary"
									type="submit"
									isBusy={ isCreating }
								>
									{ __( 'Add Contact', 'wp-erp' ) }
								</Button>
							</Flex>
						</Flex>
					</form>
				</CardBody>
			</Card>
		</>
	);
};

export default ContactForm;
