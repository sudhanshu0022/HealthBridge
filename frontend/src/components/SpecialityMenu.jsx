import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {
  return (
    <div className='flex flex-col items-center justify-center gap-4 py-20 text-gray-800 animate-fade-in' id='speciality'>
        <h1 className='text-3xl md:text-4xl font-bold text-gray-900 tracking-tight'>Find by Speciality</h1>
        <p className='sm:w-1/2 text-center text-sm text-gray-500 font-medium leading-relaxed'>
          Explore verified medical professionals across all major healthcare domains and schedule your appointment today.
        </p>
        
        <div className='flex sm:justify-center gap-6 pt-8 w-full overflow-x-auto pb-4 scrollbar-thin'>
            {specialityData.map((item, index) => ( 
                <Link 
                  onClick={() => scrollTo(0,0)} 
                  className='flex flex-col items-center text-xs font-semibold text-gray-600 cursor-pointer flex-shrink-0 hover:translate-y-[-8px] transition-all duration-300 group' 
                  key={index} 
                  to={`/doctors/${item.speciality}`}
                >
                    <div className='w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-50/50 flex items-center justify-center border border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50/80 transition-all duration-300 shadow-sm mb-3 group-hover:scale-105 group-hover:shadow-md'>
                        <img className='w-10 sm:w-12 h-10 sm:h-12 object-contain' src={item.image} alt={item.speciality} />
                    </div>
                    <p className='group-hover:text-indigo-600 transition-colors duration-300 text-center font-medium'>{item.speciality}</p>
                </Link>
            ))} 
        </div>
    </div>
  )
}

export default SpecialityMenu