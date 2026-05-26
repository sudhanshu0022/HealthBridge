import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>ABOUT <span className='text-gray-700 font-semibold'>US</span></p>
      </div>
    
      <div className='my-10 flex flex-col md:flex-row gap-12 items-center'>
        <img className='w-full md:max-w-[360px] rounded-lg shadow-md' src={assets.about_image} alt="About Us" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600 leading-relaxed'>
          <p>
            Welcome to <span className='text-blue-600 font-bold'>Healthbridge</span>, your trusted partner in managing your family's healthcare journey. We are dedicated to bridging the gap between patients and specialized doctors, making healthcare scheduling seamless, accessible, and completely stress-free.
          </p>
          <p>
            At Healthbridge, we believe that quality medical care should be just a few clicks away. Our platform brings together verified medical professionals across multiple specialties—from pediatricians and gynecologists to neurologists and dermatologists—allowing you to browse, read bio reviews, and book real-time appointments anytime, anywhere.
          </p>
          <b className='text-gray-800 text-base'>Our Vision</b>
          <p>
            Our vision is to build a healthier society by offering a unified full-stack ecosystem that simplifies healthcare appointments. We aim to empower patients with complete transparency over consultation fees, availability times, and doctor details, while supporting medical clinics in managing patient schedules efficiently.
          </p>
        </div>
      </div>
    </div>
  )
}

export default About