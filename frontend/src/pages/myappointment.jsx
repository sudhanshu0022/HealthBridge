import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyAppointment = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);

  // Fetch all user appointments
  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { token }
      });
      if (data.success) {
        // Reverse array to show latest appointments first
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Cancel an appointment
  const cancelBooking = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/cancel-appointment`, { appointmentId }, {
        headers: { token }
      });
      if (data.success) {
        toast.success(data.message);
        getUserAppointments(); // Refresh list
        getDoctorsData();      // Refresh global doctor slots
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div className="animate-fade-in px-4 sm:px-10 max-w-4xl mx-auto my-8">
      <div className="flex flex-col gap-1 pb-4 border-b border-gray-100 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Appointments</h2>
        <p className="text-gray-500 text-sm">
          Track and manage your upcoming clinic appointments and booking history.
        </p>
      </div>
      
      {appointments.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-2xl border border-dashed border-gray-300">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500 font-medium">You have no booked appointments yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {appointments.map((item, index) => (
            <div 
              className="glass-card border border-white/50 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-5 items-center justify-between" 
              key={index}
            >
              {/* Doctor Details */}
              <div className="flex flex-col sm:flex-row gap-4 items-center w-full md:w-auto">
                <div className="w-24 h-24 rounded-xl overflow-hidden shadow-sm bg-slate-50 border border-slate-100 flex-shrink-0">
                  <img className="w-full h-full object-cover" src={item.docData?.image} alt={item.docData?.name} />
                </div>
                
                <div className="text-center sm:text-left text-sm text-gray-500 flex flex-col gap-0.5">
                  <h4 className="text-gray-900 font-bold text-base">{item.docData?.name}</h4>
                  <span className="text-xs text-indigo-600 font-semibold">{item.docData?.speciality}</span>
                  
                  <div className="mt-2 text-xs text-gray-400">
                    <p className="font-semibold text-gray-500">Address:</p>
                    <p>{item.docData?.address?.line1}</p>
                    {item.docData?.address?.line2 && <p>{item.docData?.address?.line2}</p>}
                  </div>
                </div>
              </div>
              
              {/* Booking Info and Actions */}
              <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-center justify-between gap-4 w-full md:w-auto md:flex-1 md:justify-end">
                <div className="text-center md:text-right">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Appointment Date & Time</p>
                  <p className="text-sm font-bold text-gray-800 mt-1">
                    {item.slotDate.replace(/_/g, '/')}
                  </p>
                  <p className="text-xs text-indigo-500 font-medium mt-0.5 bg-indigo-50 px-2.5 py-0.5 rounded-full inline-block">
                    {item.slotTime}
                  </p>
                </div>
                
                <div className="flex flex-col gap-2 w-full sm:w-48">
                  {/* Completed and Cancelled states */}
                  {!item.cancelled && !item.isCompleted && (
                    <>
                      <button className="py-2.5 px-4 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all duration-300 cursor-pointer">
                        Pay Online
                      </button>
                      <button 
                        onClick={() => cancelBooking(item._id)} 
                        className="py-2.5 px-4 border border-rose-200 text-rose-600 bg-rose-50/20 rounded-xl text-xs font-bold hover:bg-rose-600 hover:text-white hover:border-transparent transition-all duration-300 cursor-pointer"
                      >
                        Cancel Booking
                      </button>
                    </>
                  )}

                  {item.cancelled && (
                    <span className="py-2.5 px-4 text-center border border-red-200 rounded-xl text-red-600 bg-red-50/50 font-bold text-xs cursor-not-allowed">
                      Cancelled
                    </span>
                  )}

                  {item.isCompleted && (
                    <span className="py-2.5 px-4 text-center border border-green-200 rounded-xl text-green-600 bg-green-50/50 font-bold text-xs cursor-not-allowed">
                      Completed
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointment;