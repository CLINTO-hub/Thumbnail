import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../config.js';
import { toast } from 'react-toastify';
import { authContext } from '../context/AuthContext.jsx';
import HashLoader from 'react-spinners/HashLoader.js';
import Cookies from 'js-cookie';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [emailValid, setEmailValid] = useState(true); 
  const [passwordStrength, setPasswordStrength] = useState(''); 
  const navigate = useNavigate();
  const { user, dispatch } = useContext(authContext);

  useEffect(() => {
    const checkTokenValidity = async (token) => {
      try {
        const res = await fetch(`${BASE_URL}/auth/verifyToken`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token })
        });
        if (!res.ok) {
          throw new Error('Invalid token');
        }
        const result = await res.json();
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: result.user,
            token: token
          }
        });
        navigate('/home');
      } catch (error) {
        console.log(error.message);
      }
    };

    const storedUser = localStorage.getItem('User') ? JSON.parse(localStorage.getItem('User')) : null;
    if (storedUser && storedUser.token) {
      checkTokenValidity(storedUser.token);
    }
  }, [navigate, dispatch]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'email') {
      validateEmail(value);
    } else if (name === 'password') {
      validatePassword(value);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    setEmailValid(emailRegex.test(email));
  };

  const validatePassword = (password) => {
    if (password.length >= 8) {
      setPasswordStrength('Strong password');
    } else {
      setPasswordStrength('Weak password (must be at least 8 characters long)');
    }
  };

  const submitHandler = async event => {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message);
      }
      Cookies.set('jwt', result.token, { expires: 7 });
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: result.data,
          token: result.token,
          apiKey: result.apiKey
        }
      });
      localStorage.setItem('User', JSON.stringify({ token: result.token }));
      setLoading(false);
      toast.success(result.message);
      navigate('/home');
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <section className='flex items-center justify-center min-h-screen px-5 lg:px-0'>
      <div className='w-full max-w-[700px] mx-auto rounded-lg shadow-md md:p-10 mt-2'>
        <h3 className='text-headingColor text-[22px] leading-9 font-bold mb-10'>
          Hello! <span className='text-blue-600'>Welcome</span> Back
        </h3>
        <form className='py-4 md:py-0'>
          <div className='mb-5'>
            <input
              type='email'
              placeholder='Enter your Email'
              name='email'
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border-b border-solid focus:outline-none focus:border-b-primaryColor text-[22px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer ${emailValid ? 'border-[#0066ff61]' : 'border-red-500'}`}
              required
            />
            {!emailValid && <p className='text-red-500 text-sm mt-1'>Invalid email format</p>}
          </div>
          <div className='mb-5'>
            <input
              type='password'
              placeholder='Password'
              name='password'
              value={formData.password}
              onChange={handleInputChange}
              className='w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[22px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer'
              required
            />
            {passwordStrength && (
              <p className={`text-sm mt-1 ${passwordStrength.includes('Weak') ? 'text-red-500' : 'text-green-600'}`}>{passwordStrength}</p>
            )}
          </div>
          <div className='mt-7'>
            <button onClick={submitHandler} type='submit' className='w-full bg-blue-600 hover:bg-blue-800 text-white text-[18px] leading-[30px] rounded-lg px-4 py-3'>
              {loading ? <HashLoader size={25} color='#fff' /> : 'Login'}
            </button>
          </div>

          <p className='mt-5 text-textColor text-center'>
            Don&apos;t have an account? <Link to='/signup' className='text-blue-500 hover:text-blue-800'>Register</Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Login;
