import React from 'react';
import { assets } from '../assets/assets';

const About = () => {
  return (
    <div className='animate-fade-in'>
      {/* Title */}
      <div className='text-center text-3xl pt-10 text-gray-500 font-medium'>
        <p>ABOUT <span className='text-indigo-600 font-bold'>US</span></p>
      </div>
    
      {/* Introduction Grid */}
      <div className='my-12 flex flex-col md:flex-row gap-12 items-center'>
        <img 
          className='w-full md:max-w-[360px] rounded-2xl shadow-lg border border-gray-200 animate-slide-in' 
          src={assets.about_image} 
          alt="About Us" 
        />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600 leading-relaxed'>
          <p>
            Welcome to <span className='text-indigo-600 font-bold'>Healthbridge</span>, your trusted partner in managing your family's healthcare journey. We are dedicated to bridging the gap between patients and specialized doctors, making healthcare scheduling seamless, accessible, and completely stress-free.
          </p>
          <p>
            At Healthbridge, we believe that quality medical care should be just a few clicks away. Our platform brings together verified medical professionals across multiple specialties—from pediatricians and gynecologists to neurologists and dermatologists—allowing you to browse, read bio reviews, and book real-time appointments anytime, anywhere.
          </p>
          <b className='text-gray-800 text-base font-bold'>Our Vision</b>
          <p>
            Our vision is to build a healthier society by offering a unified full-stack ecosystem that simplifies healthcare appointments. We aim to empower patients with complete transparency over consultation fees, availability times, and doctor details, while supporting medical clinics in managing patient schedules efficiently.
          </p>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className='text-xl my-8 text-gray-800 font-bold'>
        <p>WHY <span className='text-indigo-600'>CHOOSE US</span></p>
      </div>
      
      <div className='flex flex-col md:flex-row mb-28 gap-6 mt-6'>
        {/* Card 1 */}
        <div className='border border-gray-200 rounded-2xl px-10 py-10 flex flex-col gap-4 text-sm text-gray-600 cursor-pointer hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:-translate-y-1.5 transition-all duration-300 group hover:shadow-lg'>
          <b className='text-gray-800 group-hover:text-white text-base font-bold transition-colors duration-300'>EFFICIENCY:</b>
          <p className='leading-relaxed text-xs group-hover:text-indigo-50 transition-colors duration-300'>
            Streamlined appointment booking that fits into your busy schedule seamlessly, with real-time slot verification.
          </p>
        </div>
        
        {/* Card 2 */}
        <div className='border border-gray-200 rounded-2xl px-10 py-10 flex flex-col gap-4 text-sm text-gray-600 cursor-pointer hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:-translate-y-1.5 transition-all duration-300 group hover:shadow-lg'>
          <b className='text-gray-800 group-hover:text-white text-base font-bold transition-colors duration-300'>CONVENIENCE:</b>
          <p className='leading-relaxed text-xs group-hover:text-indigo-50 transition-colors duration-300'>
            Immediate access to a verified network of leading healthcare professionals in your local area and digital medical reviews.
          </p>
        </div>
        
        {/* Card 3 */}
        <div className='border border-gray-200 rounded-2xl px-10 py-10 flex flex-col gap-4 text-sm text-gray-600 cursor-pointer hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:-translate-y-1.5 transition-all duration-300 group hover:shadow-lg'>
          <b className='text-gray-800 group-hover:text-white text-base font-bold transition-colors duration-300'>PERSONALIZATION:</b>
          <p className='leading-relaxed text-xs group-hover:text-indigo-50 transition-colors duration-300'>
            Tailored recommendations, detailed filter search systems, and notifications to help you stay on top of your health easily.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;