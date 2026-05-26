import React from 'react'
import {assets} from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
           <div>
            <img className='mb-5 w-40' src={assets.logo} alt="logo" />
            <p className='w-full md:w-2/3 text-gray-600 leading-6'>HealthBridge is a leading healthcare platform dedicated to providing accessible and quality medical services to patients around the globe.</p>
           </div>

           <div>
            <p className='text-xl font-medium mb-5'>company</p>
            <ul className='flex flex-col gap-2 text-gray-600'>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
           </div>

        <div>
            <p className='text-xl font-medium mb-5'>Get in touch</p>
            <ul className='flex flex-col gap-2 text-gray-600'>
              <li>Email: <a href="mailto:info@yourcompany.com">info@yourcompany.com</a></li>
              <li>Phone: <a href="tel:+1234567890">+1234567890</a></li>
            </ul>
        </div>
      </div>
      <div>
        <hr/>
        <p className='py-5 text-sm text-center'>Copyright 2026@ HealthBridge. All rights reserved.</p>
      </div>
 </div>
  )
}

export default Footer