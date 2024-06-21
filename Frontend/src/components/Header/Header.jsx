import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate, NavLink, Link } from 'react-router-dom';
import headerBackground from '../../assets/images/Header.png';
import { authContext } from '../context/AuthContext.jsx';
import logo from '../../assets/images/logo.png';
import Cookies from 'js-cookie';

const navLinks = [
  { path: '/Home', display: 'Home' },
  { path: '/getimages', display: 'Uploaded Images' },
];

const Header = () => {
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const { user, token, dispatch } = useContext(authContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('jwt');
    localStorage.removeItem('User'); 
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 80);
    setPrevScrollPos(currentScrollPos);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  return (
    <header
      className={`header flex items-center ${visible ? '' : 'hidden'}`}
      ref={headerRef}
      style={{
        backgroundImage: `url(${headerBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '90px',
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 w-full justify-between">
            <div className="flex items-center">
              <img src={logo} alt="Logo" className="w-[140px] h-[80px]" />
            </div>
            {token && user && (
              <div className="navigation flex justify-center w-full" ref={menuRef}>
                <ul className="menu flex items-center gap-8 md:gap-18 lg:gap-28">
                  {navLinks.map((link, index) => (
                    <li key={index}>
                      <NavLink
                        to={link.path}
                        activeClassName="text-blue-600 font-bold"
                        className="text-black-500 text-lg leading-7 font-bold hover:text-blue-600 whitespace-nowrap"
                      >
                        {link.display}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex items-center gap-4 ml-auto">
              {token && user ? (
                <div className="flex items-center">
                  <figure className="w-[35px] h-[35px] rounded-full cursor-pointer mr-2">
                    <img src={user?.photo} className="w-full h-full rounded-full" alt="" />
                  </figure>
                  <button
                    onClick={handleLogout}
                    className="bg-primaryColor py-1 px-4 text-white text-sm font-semibold rounded-full"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login">
                  <button className="bg-blue-700 hover:bg-blue-800 py-2 px-6 text-white font-semibold h-[35px] flex items-center justify-center rounded-full">
                    Login
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
