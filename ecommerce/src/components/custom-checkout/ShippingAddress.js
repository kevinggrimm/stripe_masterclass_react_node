import React from 'react';
import { Formik } from 'formik';

const validate = values => {
    const { name, email, address } = values;
    const errors = {};
    
    if (!email) { errors.email = 'Required' };
    if (!name) { errors.name = 'Required' };
    if (!address) { errors.address = 'Required' };
    
    return errors;
}

/*
- Need to pass initial values to Formik
- setShipping state is passed down from parent
*/
const ShippingAddress = ({ setShipping }) => {
    const initialValues = {
        email: '',
        name: '',
        address: ''
    };

    return (
        <div>
            <h4>Shipping Address</h4>
            <Formik
                initialValues={initialValues}
                validate={validate}
                onSubmit={(values) => {
                    console.log('values: ', values);
                    setShipping(values);
                }}
            >
                {
                    ({ values, errors, handleChange, handleSubmit }) => {
                        // Destructure from errors object (if present, there is an error)
                        const { name, email, address } = errors;
                        return (
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <input 
                                        type='text'
                                        placeholder='name'
                                        name='name'
                                        onChange={handleChange}
                                        value={values.name}
                                        // Apply error class if there are errors
                                        className={ 'nomad-input ' + (name ? 'error' : '') }
                                    />
                                </div>
                                <div>
                                    <input 
                                        type='email'
                                        placeholder='email'
                                        name='email'
                                        onChange={handleChange}
                                        value={values.email}
                                        // Apply error class if there are errors
                                        className={ 'nomad-input ' + (email ? 'error' : '') }
                                    />
                                </div>
                                <div>
                                    <input 
                                        type='text'
                                        placeholder='address'
                                        name='address'
                                        onChange={handleChange}
                                        value={values.address}
                                        // Apply error class if there are errors
                                        className={ 'nomad-input ' + (address ? 'error' : '') }
                                    />
                                </div>
                                <div className='submit-btn'>
                                    <button
                                        type='submit'
                                        className='button is-black nomad-btn submit'
                                    >
                                        CONTINUE
                                    </button>
                                </div>
                            </form>
                        );
                    }
                }
            </Formik>
        </div>
    )
};

export default ShippingAddress;