import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div className="animate-fade-in px-4 sm:px-10">
      <div className="text-center text-3xl pt-10 font-medium">
        <p className="text-gray-500">
          CONTACT <span className="gradient-text font-semibold">US</span>
        </p>
        <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">
          Have questions or need assistance? Reach out to our dedicated team at Healthbridge.
        </p>
      </div>

      <div className="my-12 flex flex-col justify-center lg:flex-row gap-12 mb-28 max-w-5xl mx-auto items-center">
        {/* Left Side - Image with Floating and Hover Zoom */}
        <div className="relative group overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 max-w-[400px] w-full">
          <img 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
            src={assets.contact_image} 
            alt="contact" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
            <p className="text-white text-sm font-light">We are here to support your journey towards better health.</p>
          </div>
        </div>

        {/* Right Side - Info Panels using Glass Cards */}
        <div className="flex flex-col gap-8 w-full lg:max-w-[480px]">
          {/* Office Card */}
          <div className="glass-card p-6 rounded-2xl shadow-md hover:shadow-lg border border-white/50 hover:border-indigo-200/50 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <h3 className="font-bold text-lg text-gray-800 uppercase tracking-wide">Our Office</h3>
            </div>
            <div className="text-gray-600 flex flex-col gap-1 text-sm pl-1">
              <p className="font-semibold text-gray-700">Healthbridge Headquarters</p>
              <p className="text-gray-500">123 Clinic Boulevard, Suite 500</p>
              <p className="text-gray-500">New Delhi, India</p>
            </div>
          </div>

          {/* Lead Dev / Founder Card */}
          <div className="glass-card p-6 rounded-2xl shadow-md hover:shadow-lg border border-white/50 hover:border-indigo-200/50 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <h3 className="font-bold text-lg text-gray-800 uppercase tracking-wide">Lead Developer & Founder</h3>
            </div>
            <div className="text-gray-600 flex flex-col gap-2 text-sm pl-1">
              <p className="text-indigo-600 font-bold text-base transition-colors duration-300 hover:text-indigo-700">Sudhanshu Kumar Agrawal</p>
              <div className="flex flex-col gap-1 text-gray-500 mt-1">
                <p className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">Email:</span> sudhanshu@healthbridge.com
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">Phone:</span> +91 98765 43210
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact