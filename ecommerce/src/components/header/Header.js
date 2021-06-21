import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import CartIcon from '../cart-icon/CartIcon';
// Firebase authentication
import { auth } from '../../firebase';
// Contains signed in user information
import { UserContext } from '../../context/user-context';

import './Header.styles.scss';

const Header = () => {
    // Pull user from context
    const { user } = useContext(UserContext);
    console.log('User: ', user);
    return (
        <nav className='nav-menu container'>
            <div className='logo'>
                <Link to='/'>NOMAD</Link>
            </div>
            <ul>
                <li>
                    <Link to='/'>
                        Home
                    </Link>
                </li>
                <li>
                    <Link to='/shop'>
                        Shop
                    </Link>
                </li>
                {/* Display different links based on login status */}
                {
                    !user && 
                    <li>
                        <Link to='/sign-in'>
                            Sign In
                        </Link>
                    </li>
                }
                {
                    user &&
                    <li>
                        {/* Sign the user out */}
                        <Link onClick={() => auth.signOut()}>
                            Sign Out
                        </Link>
                    </li>
                }
                {/* Sign up if they don't have an account */}
                {
                    !user && 
                    <li>
                        <Link to='/sign-up'>
                            Sign Up
                        </Link>
                    </li>
                }
            </ul>
            <CartIcon />
        </nav>
    );
};

export default Header;