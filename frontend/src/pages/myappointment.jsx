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
        getUserAppointments(); // Refresh page list
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
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">My Appointments</p>
      
      {appointments.length === 0 ? (
        <div className="text-center py-16 text-gray-500 font-medium">
          You have no booked appointments.
        </div>
      ) : (
        <div className="flex flex-col gap-4 mt-4">
          {appointments.map((item, index) => (
            <div className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b" key={index}>
              <div>
                <img className='w-32 bg-indigo-50 rounded object-cover h-36' src={item.docData?.image} alt={item.docData?.name} />
              </div>
              
              <div className='flex-1 text-sm text-zinc-600'>
                <p className="text-neutral-800 font-semibold text-base">{item.docData?.name}</p>
                <p className="text-gray-500">{item.docData?.speciality}</p>
                
                <p className="text-xs mt-2 font-medium text-neutral-700">Address:</p>
                <p className="text-xs text-gray-500">{item.docData?.address?.line1}</p>
                <p className="text-xs text-gray-500">{item.docData?.address?.line2}</p>
                
                <p className='text-xs mt-3'>
                  <span className="text-sm text-neutral-700 font-medium">Date & Time: </span> 
                  {item.slotDate.replace(/_/g, '/')} | {item.slotTime}
                </p>
              </div>
              
              <div className='flex flex-col gap-2 justify-end text-sm sm:min-w-48'>
                {/* Completed and Cancelled states */}
                {!item.cancelled && !item.isCompleted && (
                  <>
                    <button className='py-2 border rounded text-stone-500 hover:bg-blue-500 hover:text-white transition-all duration-300 cursor-pointer'>
                      Pay Online
                    </button>
                    <button 
                      onClick={() => cancelBooking(item._id)} 
                      className='py-2 border rounded text-stone-500 hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer'
                    >
                      Cancel Appointment
                    </button>
                  </>
                )}

                {item.cancelled && (
                  <button className='py-2 border border-red-500 rounded text-red-500 bg-red-50/50 cursor-not-allowed font-medium' disabled>
                    Appointment Cancelled
                  </button>
                )}

                {item.isCompleted && (
                  <button className='py-2 border border-green-500 rounded text-green-500 bg-green-50/50 cursor-not-allowed font-medium' disabled>
                    Completed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointment;