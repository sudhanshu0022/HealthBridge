import React from 'react'  
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const TopDoctors = () => {
    const navigate = useNavigate()
    const { doctors } = React.useContext(AppContext)
    
  return (
    <div className='flex flex-col items-center gap-4 py-20 text-gray-900 md:mx-10 animate-fade-in'>
        <h1 className='text-3xl md:text-4xl font-bold tracking-tight text-gray-900'>Top Doctors to Book</h1>
        <p className='sm:w-1/2 text-center text-sm text-gray-500 font-medium leading-relaxed'>
          Browse our selection of highly rated, verified specialists and book your appointment instantly.
        </p>
        
        <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 pt-10 px-3 sm:px-0'> 
            {doctors.slice(0, 10).map((item, index) => (
                <div 
                  onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0,0); }} 
                  className='border border-gray-200/80 rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-2 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 bg-white group' 
                  key={index}
                >
                    <div className='overflow-hidden bg-indigo-50/30 h-52'>
                        <img 
                          className='w-full h-full object-cover group-hover:scale-105 transition-all duration-500' 
                          src={item.image} 
                          alt={item.name} 
                        />
                    </div>
                    <div className='p-4 flex flex-col gap-1'>
                        <div className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${item.available ? 'text-green-600 bg-green-50' : 'text-gray-500 bg-gray-50'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${item.available ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                            <span>{item.available ? 'Available' : 'Unavailable'}</span>
                        </div>
                        <p className='text-gray-900 text-base font-bold mt-1 group-hover:text-indigo-600 transition-colors duration-300'>{item.name}</p>
                        <p className='text-gray-500 text-xs font-medium'>{item.speciality}</p>
                    </div>
                </div>
            ))}
        </div>
        
        <button 
          onClick={() => { navigate('/doctors'); scrollTo(0,0); }} 
          className='bg-indigo-600 text-white font-bold px-12 py-3.5 rounded-full mt-12 hover:bg-indigo-700 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer'
        >
          View All Doctors
        </button>
    </div>
  )
}

export default TopDoctors