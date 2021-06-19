import React, { useState } from 'react';
import Layout from '../shared/Layout';
import { Formik } from 'formik';
import { withRouter } from 'react-router-dom';
import { auth } from '../../firebase';
import '../signup/Signup.styles.scss';

const SignIn = ({ history: { push } }) => {
    const [ submitting, setSubmitting ] = useState(true);
    const [ error, setError ] = useState(null);
    const initialValue = {
        email: '',
        password: '',
    };
    
    // Values are coming from Formik
    const handleSignIn = async (values, { setSubmitting }) => {
        const { email, password } = values;
        try {
            // Make call to firebase signin method
            // Try to sign the user in and redirect
            await auth.signInWithEmailAndPassword(email, password);
            setSubmitting(false);
            push('/shop');
        } catch (error) {
            // Log out error
            console.log(error);
            setSubmitting(false);
            setError(error);
        }
    };


    return (
        <Layout>
            <h1>Sign In</h1>
            <div className='form-container'>
                <Formik
                    initialValues={initialValue}
                    onSubmit={handleSignIn}
                >
                    {
                        (values,  handleChange, handleSubmit, isSubmitting) => {
                            /*
                                NOTE - Errors are handled by the database
                                For App, this will come w/ Amplify Auth
                            */
                            // const { email, password } = errors;
                            return (
                                <form onSubmit={handleSubmit}>
                                    <div>
                                        <input
                                            type='email'
                                            name='email'
                                            onChange={handleChange}
                                            placeholder='Email'
                                            className={ 'nomad-input'}
                                            value={values.email}
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type='password'
                                            name='password'
                                            onChange={handleChange}
                                            placeholder='Password'
                                            className={ 'nomad-input'}
                                            value={values.password}
                                        />
                                    </div>
                                    <div className='submit-btn'>
                                        <button
                                            type='submit'
                                            disabled={isSubmitting}
                                            className='button is-black nomad-btn submit'
                                        >
                                            Sign In
                                        </button>
                                    </div>
                                    <div>
                                        {
                                            error && (<p className='error-message'>{error.message}</p>)
                                        }
                                    </div>
                                </form>
                            )
                        }
                    }
                </Formik>
            </div>
        </Layout>
    );
};

export default withRouter(SignIn);