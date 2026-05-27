import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
  return (
    <div className='flex flex-col md:flex-row flex-wrap bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 rounded-2xl px-6 md:px-10 lg:px-20 shadow-xl overflow-hidden mb-12 animate-fade-in'>

       {/* Left Column: Text & CTA */}
       <div className='md:w-1/2 flex flex-col items-start justify-center gap-6 py-12 md:py-[8vw] md:mb-[-20px] animate-slide-in'>
           {/* Trust Badge */}
           <div className='flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-xs font-semibold tracking-wide border border-white/10'>
             <span>⭐ 4.9/5 Trust Score</span>
             <span className='w-1 h-1 bg-white rounded-full'></span>
             <span>50K+ Happy Patients</span>
           </div>
           
           <h1 className='text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-tight md:leading-tight lg:leading-tight tracking-tight'>
            Book Appointment<br />
            <span className='bg-gradient-to-r from-teal-200 to-emerald-300 bg-clip-text text-transparent'>with Trusted Doctors</span>
           </h1>
          <div className='text-blue-50 text-sm font-medium leading-relaxed max-w-md'>
           <p>
            Find the best specialist doctors in your area and book real-time slots in just a few clicks. Your health, our priority.
           </p>
          </div>
          <a href="#speciality" className='flex items-center gap-2 bg-white px-8 py-3 rounded-full text-indigo-600 font-bold text-sm hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer'>
            Book Now 
            <span className='text-xs'>➔</span>
          </a>
       </div>

       {/* Right Column: Image */}
       <div className='md:w-1/2 relative flex items-end justify-center pt-8 md:pt-0'>
         <img className='w-full md:absolute bottom-0 h-auto max-h-[110%] object-contain rounded-t-lg animate-float' src={assets.doctorshome} alt="Doctors" />
       </div>
    </div>
  )
}

export default Header