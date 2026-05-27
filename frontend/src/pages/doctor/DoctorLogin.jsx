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

  useEffect(() => {
    if (dToken) {
      navigate('/doctor-dashboard');
    }
  }, [dToken, navigate]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center relative overflow-hidden px-4 animate-fade-in">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-indigo-500/10 rounded-full filter blur-3xl -z-10 animate-float"></div>
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-500/10 rounded-full filter blur-3xl -z-10 animate-float" style={{ animationDelay: '2s' }}></div>

      <form onSubmit={onSubmitHandler} className="w-full max-w-md">
        <div className="glass-card p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/60 text-gray-700 text-sm flex flex-col gap-5">
          <div>
            <h2 className="text-3xl font-black text-indigo-600 tracking-tight">
              Doctor Login
            </h2>
            <p className="text-gray-400 text-xs mt-1.5 font-medium">
              Please log in to manage your appointments, patient consults, and availability.
            </p>
          </div>

          <div className="w-full">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Email Address</label>
            <input
              className="w-full px-4 py-3 mt-1.5 border border-gray-200/80 rounded-xl bg-white/70 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-sm font-semibold"
              type="email"
              placeholder="doctor@healthbridge.com"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>

          <div className="w-full">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Password</label>
            <input
              className="w-full px-4 py-3 mt-1.5 border border-gray-200/80 rounded-xl bg-white/70 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-sm font-semibold"
              type="password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:shadow-indigo-200/50 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 cursor-pointer mt-2"
          >
            Access Dashboard
          </button>

          <div className="text-center mt-2 border-t border-gray-100/60 pt-4 flex flex-col gap-2">
            <p className="text-xs text-gray-400">
              Are you a Patient?{' '}
              <span onClick={() => navigate('/login')} className="text-indigo-600 font-semibold hover:underline cursor-pointer">
                Patient Login Portal
              </span>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DoctorLogin;
