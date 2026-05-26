import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const DoctorLogin = () => {
  const { backendUrl, dToken, setDToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      // Doctor Login API Call
      const { data } = await axios.post(`${backendUrl}/api/doctor/login`, { email, password });
      
      if (data.success) {
        localStorage.setItem('dtoken', data.token);
        setDToken(data.token);
        toast.success("Doctor logged in successfully!");
        navigate('/doctor-dashboard');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Redirect if doctor is already logged in
  useEffect(() => {
    if (dToken) {
      navigate('/doctor-dashboard');
    }
  }, [dToken, navigate]);

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg bg-white'>
        <p className='text-2xl font-semibold text-indigo-600'>Doctor Login</p>
        <p>Please log in to manage your appointments and availability</p>

        <div className='w-full'>
          <p>Email Address</p>
          <input
            className='border border-zinc-300 rounded w-full p-2 mt-1 focus:border-indigo-500 outline-none'
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        <div className='w-full'>
          <p>Password</p>
          <input
            className='border border-zinc-300 rounded w-full p-2 mt-1 focus:border-indigo-500 outline-none'
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>

        <button type="submit" className='bg-indigo-600 text-white w-full py-2 rounded-md text-base hover:bg-indigo-700 transition-all cursor-pointer mt-2'>
          Login
        </button>

        <p className="mt-2 text-xs text-center w-full">
          Are you a Patient?{' '}
          <span onClick={() => navigate('/login')} className='text-blue-500 underline cursor-pointer hover:text-blue-600'>
            Login here
          </span>
        </p>
      </div>
    </form>
  );
};

export default DoctorLogin;
