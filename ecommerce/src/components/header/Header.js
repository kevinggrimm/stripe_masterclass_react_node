import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import CartIcon from '../cart-icon/CartIcon';
import { auth } from '../../firebase';
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
            </ul>
            <CartIcon />
        </nav>
    );
};

export default Header;