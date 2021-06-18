import React from 'react';
import { withRouter } from 'react-router-dom';
import Layout from '../../shared/Layout';

const Cancel = ({ history }) => {
    return (
        <Layout>
            <div className='checkout'>
                <h1>Payment Failed</h1>
                <p>Payment was not successful</p>
                <div>
                    <button className='button is-black nomad-btn submit'
                        onClick={() => history.push('/shop')}>
                        Continue Shopping
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default withRouter(Cancel);