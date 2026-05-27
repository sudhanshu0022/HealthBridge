import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [state, setState] = useState('Login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');  

  const onSubmitHandler = async (event) => {
    event.preventDefault(); 
    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          toast.success("Account created successfully!");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, { email, password });
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          toast.success("Logged in successfully!");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  }; 

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center relative overflow-hidden px-4 animate-fade-in">
      {/* Dynamic Glowing Blur Orbs */}
      <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-blue-400/20 rounded-full filter blur-3xl -z-10 animate-float"></div>
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-indigo-400/20 rounded-full filter blur-3xl -z-10 animate-float" style={{ animationDelay: '2s' }}></div>

      <form onSubmit={onSubmitHandler} className="w-full max-w-md">
        <div className="glass-card p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/60 text-gray-700 text-sm flex flex-col gap-5"> 
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              {state === 'Sign Up' ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-400 text-xs mt-1.5 font-medium">
              Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book an appointment with our doctors.
            </p>
          </div>
          
          {state === 'Sign Up' && (
            <div className="w-full">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Full Name</label>
              <input 
                className="w-full px-4 py-3 mt-1.5 border border-gray-200/80 rounded-xl bg-white/70 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-sm font-semibold" 
                type="text" 
                onChange={(e) => setName(e.target.value)} 
                value={name} 
                placeholder="John Doe"
                required 
              />
            </div>
          )}
          
          <div className="w-full">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Email Address</label>
            <input 
              className="w-full px-4 py-3 mt-1.5 border border-gray-200/80 rounded-xl bg-white/70 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-sm font-semibold" 
              type="email" 
              onChange={(e) => setEmail(e.target.value)} 
              value={email} 
              placeholder="example@mail.com"
              required 
            />
          </div>
          
          <div className="w-full">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Password</label>
            <input 
              className="w-full px-4 py-3 mt-1.5 border border-gray-200/80 rounded-xl bg-white/70 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-sm font-semibold" 
              type="password" 
              onChange={(e) => setPassword(e.target.value)} 
              value={password} 
              placeholder="••••••••"
              required 
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:shadow-indigo-200/50 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 cursor-pointer mt-2"
          >
            {state === 'Sign Up' ? "Create Account" : "Login"}
          </button>
          
          <div className="text-center mt-1 border-t border-gray-100/60 pt-4 flex flex-col gap-3">
            {state === 'Sign Up' ? (
              <p className="text-gray-500 text-xs">
                Already have an account?{' '}
                <span onClick={() => setState('Login')} className="text-indigo-600 font-bold hover:underline cursor-pointer">
                  Login here
                </span>
              </p>
            ) : (
              <p className="text-gray-500 text-xs">
                New to Healthbridge?{' '}
                <span onClick={() => setState('Sign Up')} className="text-indigo-600 font-bold hover:underline cursor-pointer">
                  Create account
                </span>
              </p>
            )}

            <div className="flex flex-col gap-2 pt-2 border-t border-gray-50">
              <p className="text-xs text-gray-400">
                Are you a Doctor?{' '}
                <span onClick={() => navigate('/doctor-login')} className="text-indigo-600 font-semibold hover:underline cursor-pointer">
                  Doctor Login Portal
                </span>
              </p>
              
              <p className="text-xs text-gray-400">
                Are you an Admin?{' '}
                <span onClick={() => navigate('/admin-login')} className="text-purple-600 font-semibold hover:underline cursor-pointer">
                  Admin Login Portal
                </span>
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;