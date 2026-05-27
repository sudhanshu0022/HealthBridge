import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Doctors = () => {

  const { speciality } = useParams()

  const [filterDoc, setFilterDoc] = useState([])

  const { doctors } = useContext(AppContext)

  const navigate = useNavigate()

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(
        doctors.filter(
          doc => doc.speciality === speciality
        )
      )
    } else {
      setFilterDoc(doctors)
    }
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality])

  const specialitiesList = [
    'General physician',
    'Gynecologist',
    'Dermatologist',
    'Cardiologist',
    'Neurologist',
    'Pediatrician'
  ]

  return (
    <div className="animate-fade-in px-4 sm:px-10">
      <div className="flex flex-col gap-1 pb-4 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800">Meet Our Specialists</h2>
        <p className="text-gray-500 text-sm">
          Browse through our verified professional healthcare providers.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-start gap-8 mt-8">
        {/* Specialty Filters Sidebar */}
        <div className="flex flex-row md:flex-col gap-3 w-full md:w-64 overflow-x-auto md:overflow-x-visible pb-3 md:pb-0 scrollbar-none sticky top-20 z-10 bg-white/80 backdrop-blur-md p-1 md:p-0 rounded-xl">
          {specialitiesList.map((spec, index) => {
            const isActive = speciality === spec;
            return (
              <button
                key={index}
                onClick={() => isActive ? navigate('/doctors') : navigate(`/doctors/${spec}`)}
                className={`whitespace-nowrap w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-300 cursor-pointer shadow-sm flex items-center justify-between ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white border-transparent shadow-indigo-100 scale-[1.02]'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-slate-50 hover:border-indigo-300'
                }`}
              >
                <span>{spec}</span>
                {isActive && (
                  <svg className="w-4 h-4 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            )
          })}
        </div>

        {/* Doctor Grid */}
        <div className="flex-1 w-full">
          {filterDoc.length === 0 ? (
            <div className="text-center py-20 glass-card rounded-2xl border border-dashed border-gray-300">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-gray-500 font-medium">No doctors found in this specialty.</p>
              <button 
                onClick={() => navigate('/doctors')} 
                className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all shadow-md"
              >
                Clear Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterDoc.map((item, index) => (
                <div
                  onClick={() => navigate(`/appointment/${item._id}`)}
                  className="group border border-slate-100 rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 bg-white flex flex-col justify-between"
                  key={index}
                >
                  <div className="relative overflow-hidden bg-slate-50 aspect-video sm:aspect-square md:aspect-auto md:h-56">
                    <img
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      src={item.image}
                      alt={item.name}
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1.5 shadow-sm ${
                        item.available 
                          ? 'bg-green-50 text-green-700 border border-green-200/50' 
                          : 'bg-red-50 text-red-700 border border-red-200/50'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.available ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                        {item.available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
                        {item.speciality}
                      </p>
                      <h3 className="text-gray-900 text-lg font-bold group-hover:text-indigo-600 transition-colors duration-300">
                        {item.name}
                      </h3>
                      <p className="text-gray-400 text-xs font-light mt-1 line-clamp-1">
                        {item.degree} — {item.experience} Exp
                      </p>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Consultation Fee</span>
                      <span className="text-gray-800 font-bold text-sm">₹{item.fees}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Doctors