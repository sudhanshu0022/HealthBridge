import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import RelatedDoctors from '../components/RelatedDoctors';
import axios from 'axios';
import { toast } from 'react-toastify';

const Appointment = () => {
  const { docId } = useParams();
  const navigate = useNavigate();

  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext);
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');

  const fetchDocInfo = async () => {
    const docInfo = doctors.find(doc => doc._id === docId);
    setDocInfo(docInfo);
  };

  const getAvailableSlots = async () => {
    if (!docInfo) return;

    setDocSlots([]);
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      // If checking today's slots, start from current hour + 1
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(
          currentDate.getMinutes() > 30 ? 30 : 0
        );
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        });

        // Format dates into dd_mm_yyyy format matching backend slots schema
        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();
        const slotDate = `${day}_${month}_${year}`;

        // Check if doctor slots_booked has this slot date and time
        const isBooked = docInfo.slots_booked && 
                         docInfo.slots_booked[slotDate] && 
                         docInfo.slots_booked[slotDate].includes(formattedTime);

        // Add to list only if slot is not already booked
        if (!isBooked) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime
          });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      setDocSlots(prev => [...prev, timeSlots]);
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warning('Please login to book an appointment');
      return navigate('/login');
    }

    try {
      const dateInfo = docSlots[slotIndex][0].datetime;
      let day = dateInfo.getDate();
      let month = dateInfo.getMonth() + 1;
      let year = dateInfo.getFullYear();
      const slotDate = `${day}_${month}_${year}`;

      const { data } = await axios.post(`${backendUrl}/api/user/book-appointment`, {
        docId,
        slotDate,
        slotTime
      }, {
        headers: { token }
      });

      if (data.success) {
        toast.success(data.message);
        getDoctorsData(); // Reload doctor availability slots globally
        navigate('/my-appointment');
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [docId, doctors]);

  useEffect(() => {
    getAvailableSlots();
  }, [docInfo]);

  return docInfo && (
    <div className="animate-fade-in px-4 sm:px-10">
      {/* Doctor Info Section */}
      <div className="flex flex-col md:flex-row gap-6 items-stretch">
        <div className="md:w-72 flex-shrink-0 relative overflow-hidden rounded-2xl border border-slate-100 shadow-md bg-slate-50 flex items-center justify-center">
          <img
            className="w-full h-full object-cover max-h-[320px] md:max-h-none"
            src={docInfo?.image}
            alt={docInfo?.name}
          />
          <div className="absolute bottom-3 left-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 shadow-md ${
              docInfo?.available 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}>
              <span className={`w-2 h-2 rounded-full bg-white ${docInfo?.available ? 'animate-pulse' : ''}`}></span>
              {docInfo?.available ? 'Online' : 'Away'}
            </span>
          </div>
        </div>

        <div className="flex-1 glass-card border border-white/50 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-sm relative">
          <div className="absolute top-6 right-6 hidden sm:block">
            <span className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a.75.75 0 00-.708-.523H4.5a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.06c.277 0 .524-.15.65-.397L7.49 13.5h5.02l1.23 2.533c.126.247.373.397.65.397h1.06a.75.75 0 00.75-.75V3.682a.75.75 0 00-.75-.75h-1.06a.75.75 0 00-.708.523L12.44 6.5H7.56L6.267 3.455zM8.54 8h2.92l-.974-2H9.513L8.54 8z" clipRule="evenodd" />
              </svg>
              Verified Specialist
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{docInfo?.name}</h2>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-sm font-semibold text-indigo-600">{docInfo?.speciality}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
              <span className="text-xs text-gray-500 font-medium">{docInfo?.degree}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
              <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md">{docInfo?.experience} Years Exp</span>
            </div>

            <div className="mt-4 border-t border-slate-100/80 pt-4">
              <h4 className="text-sm font-bold text-gray-800 mb-1.5">Biography</h4>
              <p className="text-sm text-gray-500 leading-relaxed max-w-[720px]">{docInfo?.about}</p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100/80 flex items-center justify-between">
            <span className="text-gray-500 font-semibold text-sm">Consultation Fee</span>
            <span className="text-2xl font-black gradient-text">
              {currencySymbol}{docInfo?.fees}
            </span>
          </div>
        </div>
      </div>

      {/* Calendar Slots */}
      <div className="mt-10 font-medium text-gray-800">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Select Appointment Slot
        </h3>

        {/* Date Selector */}
        <div className="flex gap-4 items-center w-full overflow-x-auto pb-4 scrollbar-none">
          {docSlots.length > 0 && docSlots.map((item, index) => (
            item.length > 0 && (
              <button 
                key={index}
                onClick={() => { setSlotIndex(index); setSlotTime(''); }} 
                className={`text-center py-4 px-5 min-w-20 rounded-2xl cursor-pointer transition-all duration-300 border flex flex-col items-center gap-1 ${
                  slotIndex === index 
                    ? 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white border-transparent shadow-lg shadow-indigo-100 scale-105' 
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-slate-50 hover:border-indigo-300'
                }`}
              >
                <p className="text-xs uppercase tracking-wider font-semibold opacity-70">
                  {item[0] && daysOfWeek[item[0].datetime.getDay()]}
                </p>
                <p className="text-xl font-bold">
                  {item[0] && item[0].datetime.getDate()}
                </p>
              </button>
            )
          ))}
        </div>

        {/* Hour Time Selector */}
        <div className="mt-4">
          <p className="text-sm font-semibold text-gray-500 mb-3">Available Hours:</p>
          <div className="flex items-center gap-3 w-full overflow-x-auto pb-4 scrollbar-none">
            {docSlots.length > 0 && docSlots[slotIndex] && docSlots[slotIndex].map((item, index) => (
              <button 
                key={index}
                onClick={() => setSlotTime(item.time)} 
                className={`text-sm font-medium flex-shrink-0 px-6 py-2.5 rounded-xl cursor-pointer transition-all duration-200 border ${
                  item.time === slotTime 
                    ? 'bg-indigo-600 text-white border-transparent shadow-md' 
                    : 'bg-white text-gray-500 border-gray-200 hover:bg-slate-50 hover:border-indigo-200 hover:text-indigo-600'
                }`}
              >
                {item.time.toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* CTA Actions */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
          <button 
            onClick={bookAppointment}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-10 py-3.5 rounded-xl font-bold transition-all duration-300 shadow-md shadow-indigo-100 hover:shadow-lg hover:shadow-indigo-200/50 hover:scale-[1.02] active:scale-[0.98] disabled:from-slate-200 disabled:to-slate-300 disabled:text-slate-400 disabled:shadow-none disabled:scale-100 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2" 
            disabled={!slotTime}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Book Appointment
          </button>
        </div>

        {/* Related Doctors */}
        <div className="mt-14 pt-8 border-t border-slate-100">
          <RelatedDoctors docId={docId} speciality={docInfo.speciality}/>
        </div>
      </div>
    </div>
  );
};

export default Appointment;