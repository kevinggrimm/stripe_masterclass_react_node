import React, { useState } from 'react';
import Layout from '../shared/Layout';
import { Formik } from 'formik';
import { withRouter } from 'react-router-dom';
// Import auth and create user profile functions
// TODO - Apply the same for DynamoDB
import { auth, createUserProfileDocument } from '../../firebase';
import './Signup.styles.scss';

/*
*/
const validate = values => {
  const errors = {};
  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }
  if (!values.firstname) { errors.firstname = 'Required' }
  if (!values.password) { errors.password = 'Required' }
  return errors;
}

// Pull of history object to redirect
const Signup = ({ history: { push }}) => {
    const [ error, setError ] = useState(null);
    const initialValues = {
        firstname: '',
        email: '',
        password: ''
    };

    /*
        1. values from Formik
        2. set of actions
    */
    const handleSignUp = async (values, { setSubmitting }) => {
        
        // Destructure values
        const { firstname, email, password } = values;
        // Try to sign the user up with the Auth object
        try {
            // 1. Call the createUser with auth function
            const { user } = await auth.createUserWithEmailAndPassword(email, password);
            // 2. Try to create the user in the database
            await createUserProfileDocument(user, { displayName: firstname });
            // 3. Redirect the user to the shop page
            push('/shop');
            // Disable the button on click. After success, set to false
            setSubmitting(false);
        } catch (error) {
            // Log + show to user - need error state
            console.log(error);
            setSubmitting(false);
            setError(error);
        }
    };

    return (
        <Layout>
            <div className='sign-up'>
                <h1>Sign Up</h1>
                <div className='form-container'>
                    <Formik
                        initialValues={initialValues}
                        // Capture errors w/ custom function
                        validate={validate}
                        onSubmit={handleSignUp}
                    >
                        {
                            ({ values, errors, handleChange, handleSubmit, isSubmitting }) => {
                                const { firstname, email, password } = errors;
                                return (
                                    <form onSubmit={handleSubmit}>
                                        <div>
                                            <input 
                                                type='text'
                                                name='firstname'
                                                onChange={handleChange}
                                                value={values.firstname}
                                                placeholder='First Name'
                                                className={ 'nomad-input ' + ( firstname ? 'error' : '' )}
                                            />
                                        </div>
                                        <div>
                                            <input 
                                                type='email'
                                                name='email'
                                                onChange={handleChange}
                                                value={values.email}
                                                placeholder='Email'
                                                className={ 'nomad-input ' + ( email ? 'error' : '' )}
                                            />
                                        </div>
                                        <div>
                                            <input 
                                                type='password'
                                                name='password'
                                                onChange={handleChange}
                                                value={values.password}
                                                placeholder='Password'
                                                className={ 'nomad-input ' + ( password ? 'error' : '' )}
                                            />
                                        </div>
                                        <div className='submit-btn'>
                                            <button
                                                type='submit'
                                                // Provided by Formik
                                                disabled={isSubmitting}
                                                className='button is-black nomad-btn submit'
                                            >
                                                Sign Up
                                            </button>
                                        </div>
                                        <div className='error-message'>
                                            {
                                                error && <p>{error.message}</p>
                                            }
                                        </div>
                                    </form>
                                )
                            }
                        }
                    </Formik>
                </div>
            </div>
        </Layout>
    );
};

export default withRouter(Signup);