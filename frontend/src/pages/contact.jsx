import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>CONTACT <span className='text-gray-700 font-semibold'>US</span></p>
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>
        <img className='w-full md:max-w-[360px] rounded-lg shadow-md' src={assets.contact_image} alt='contact' />

        <div className='flex flex-col justify-center items-start gap-6 leading-relaxed'>
          <p className='font-bold text-lg text-gray-800 uppercase tracking-wide border-b pb-2 w-full'>Our Office</p>
          
          <div className='text-gray-500 flex flex-col gap-1'>
            <p className='font-semibold text-gray-700'>Healthbridge Headquarters</p>
            <p>123 Clinic Boulevard, Suite 500</p>
            <p>New Delhi, India</p>
          </div>
          
          <div className='text-gray-500 flex flex-col gap-1'>
            <p className='font-semibold text-gray-700'>Lead Developer & Founder</p>
            <p className='text-blue-600 font-bold text-base'>Sudhanshu Kumar Agrawal</p>
            <p>Email: sudhanshu@healthbridge.com</p>
            <p>Phone: +91 98765 43210</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact