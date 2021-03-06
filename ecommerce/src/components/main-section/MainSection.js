import React from 'react';
import { withRouter } from 'react-router-dom';
import studioBag from '../../assets/studio-bag.png';
import './MainSection.styles.scss';

// Get history object from router
const MainSection = ({ history }) => {
    return (
        <div className='main-section-container'>
            <div className='main-section-middle'>
                <div className='ms-m-image'>
                    <img src={studioBag} alt='studio bag' />
                </div>
                <div className='ms-m-description'>
                    <h2>Designed for fashion. Crafted for sport.</h2>
                    <p>
                        We make products that transform day to night. From the board to the fitness stuido and everywhere in between, each Nomads piece is thoughtfully created to be the perfect balance of form and function.
                    </p>
                    {/* Push to product page */}
                    <button classname='button is-black' id='shop-now' onClick={() => history.push('/product/1')}>
                        STUDIO BAG
                    </button>
                </div>
            </div>
        </div>
    );
};

export default withRouter(MainSection);