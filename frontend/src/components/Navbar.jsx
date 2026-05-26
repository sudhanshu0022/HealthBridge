import React, { useState, useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const Navbar = () => {

     const navigate = useNavigate();   
    
     const [showMenu,setShowMenu] = useState(false)
     const { token, setToken, userData, dToken, setDToken, aToken, setAToken } = useContext(AppContext)

     const logout = () => {
         setToken('')
         localStorage.removeItem('token')
         navigate('/login')
     }

  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
        <img onClick={() => navigate('/')} src={assets.logo} alt="logo" className='w-40 cursor-pointer' />
        <ul className='hidden md:flex items-start gap-5 font-medium'>
          <NavLink to='/'>
              <li className='py-1'>Home</li>
              <hr className='border-none outline-none h-0.5 bg-blue-500 w-3/5 m-auto hidden'/>
          </NavLink>
          <NavLink to='/doctors'>
              <li className='py-1'>All Doctor</li>
              <hr className='border-none outline-none h-0.5 bg-blue-500 w-3/5 m-auto hidden'/>
          </NavLink>
          <NavLink to='/about'>
              <li className='py-1'>About Us</li>
              <hr className='border-none outline-none h-0.5 bg-blue-500 w-3/5 m-auto hidden'/>
          </NavLink>
          <NavLink to='/contact'> 
              <li className='py-1'>Contact Us</li>
              <hr className='border-none outline-none h-0.5 bg-blue-500 w-3/5 m-auto hidden'/>
          </NavLink>
        </ul>
        <div className='flex items-center gap-4'>
          {
            aToken
            ? <div className='flex items-center gap-3'>
                <button onClick={() => navigate('/admin-dashboard')} className='border border-red-500 text-red-500 px-4 py-2 rounded-full font-medium hover:bg-red-500 hover:text-white transition-all cursor-pointer'>Admin Panel</button>
                <button onClick={() => { setAToken(''); localStorage.removeItem('atoken'); navigate('/'); }} className='bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-medium hover:bg-gray-300 transition-all cursor-pointer'>Logout</button>
              </div>
            : dToken 
            ? <div className='flex items-center gap-3'>
                <button onClick={() => navigate('/doctor-dashboard')} className='border border-blue-500 text-blue-500 px-4 py-2 rounded-full font-medium hover:bg-blue-500 hover:text-white transition-all cursor-pointer'>Doctor Panel</button>
                <button onClick={() => { setDToken(''); localStorage.removeItem('dtoken'); navigate('/'); }} className='bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-medium hover:bg-gray-300 transition-all cursor-pointer'>Logout</button>
              </div>
            : token && userData
            ? <div className='flex items-center gap-2 cursor-pointer group relative'>
              <img className='w-8 h-8 rounded-full object-cover' src={userData.image || assets.profile_pic} alt=''/>
              <img className='w-2.5' src={assets.dropdown_icon} alt='' />
              <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                  <p onClick={()=>navigate('my-profile')} className='hover:text-black cursor-pointer'>MyProfile</p>
                  <p onClick={()=>navigate('my-appointment')} className='hover:text-black cursor-pointer'>My Appointment</p>
                  <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
                </div>
              </div>
            </div>
            :<button onClick={()=>navigate('/login')} className='bg-blue-500 text-white px-8 py-3 rounded-full font-light hidden md:block'>Create Account</button>
          }
          
        </div>
    </div>
  )
}

export default Navbar