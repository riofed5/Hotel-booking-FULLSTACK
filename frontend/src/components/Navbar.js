import React, {useState} from 'react'
import logo from '../images/logo.svg';
import {FaAlignRight} from 'react-icons/fa';
import {Link, NavLink} from 'react-router-dom';
import {withRoomConsumer} from '../context';

const Navbar = ({context}) => {

    const {token, logout} = context;

    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    }

    return (
        <>
        <nav className="navbar">
            <div className="nav-center">
                <div className="nav-header">
                    <NavLink to="/">
                        <img src={logo} alt="Beach resort" />
                    </NavLink>
                    <button type="button"
                        className="nav-btn"
                        onClick={handleToggle}>
                        <FaAlignRight className="nav-icon" />
                    </button>
                </div>
                <ul className={isOpen ? "nav-links show-nav" : "nav-links"}>
                    <li>
                        <NavLink exact to="/">Home</NavLink>
                    </li>
                    <li>
                        <NavLink to="/rooms">Rooms</NavLink>
                    </li>
                    {!token && (
                        <li>
                            <NavLink to="/auth">Authenticate</NavLink>
                        </li>
                    )}
                    {token && (
                        <React.Fragment>
                            <li>
                                <NavLink to="/bookings">Bookings</NavLink>
                            </li>
                            <li>
                                <Link to="/" onClick={logout} style={{color: 'red'}}>Logout</Link>
                            </li>
                        </React.Fragment>
                    )}
                </ul>
            </div>
        </nav>
    </>
    )
}

export default withRoomConsumer(Navbar);
