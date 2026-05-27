import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
  const { backendUrl, dToken } = useContext(AppContext);
  const navigate = useNavigate();

  // Tab State
  const [activeTab, setActiveTab] = useState('appointments'); // 'appointments' or 'profile'

  // Dashboard Stats
  const [stats, setStats] = useState(null);
  
  // Appointments List
  const [appointments, setAppointments] = useState([]);

  // Doctor Profile settings
  const [profileData, setProfileData] = useState(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Fetch Dashboard Stats
  const getDashboardStats = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/dashboard`, {
        headers: { dtoken: dToken }
      });
      if (data.success) {
        setStats(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Fetch Appointments List
  const getDoctorAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, {
        headers: { dtoken: dToken }
      });
      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Fetch Profile Settings
  const getDoctorProfile = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/profile`, {
        headers: { dtoken: dToken }
      });
      if (data.success) {
        setProfileData(data.profileData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Mark Appointment Completed
  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/doctor/complete-appointment`, { appointmentId }, {
        headers: { dtoken: dToken }
      });
      if (data.success) {
        toast.success(data.message);
        getDoctorAppointments();
        getDashboardStats();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Cancel Appointment by Doctor
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/doctor/cancel-appointment`, { appointmentId }, {
        headers: { dtoken: dToken }
      });
      if (data.success) {
        toast.success(data.message);
        getDoctorAppointments();
        getDashboardStats();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Update Settings/Profile
  const saveProfileSettings = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/doctor/update-profile`, {
        fees: profileData.fees,
        available: profileData.available,
        about: profileData.about,
        address: profileData.address
      }, {
        headers: { dtoken: dToken }
      });

      if (data.success) {
        toast.success(data.message);
        getDoctorProfile();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Initial Load & Auth Check
  useEffect(() => {
    if (!dToken) {
      toast.warning("Please login to access Doctor Dashboard");
      navigate('/doctor-login');
    } else {
      getDashboardStats();
      getDoctorAppointments();
      getDoctorProfile();
    }
  }, [dToken, navigate]);

  return (
    <div className="animate-fade-in px-4 sm:px-10 py-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 border border-transparent rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
        {/* Abstract shapes inside banner */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full filter blur-2xl -z-0 translate-x-12 -translate-y-12"></div>
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-indigo-500/20 rounded-full filter blur-xl -z-0 translate-y-12"></div>

        <div className="relative z-10 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-black">Welcome back, {profileData?.name || 'Doctor'}!</h1>
          <p className="text-sm text-indigo-100 mt-1.5 font-medium bg-white/15 px-3 py-1 rounded-full inline-block">
            {profileData?.speciality || 'Clinic Specialist'}
          </p>
        </div>
        <div className="relative z-10 mt-4 sm:mt-0 flex-shrink-0">
          <img 
            className="w-20 h-20 rounded-2xl object-cover border-4 border-white/40 bg-white shadow-lg" 
            src={profileData?.image || 'https://via.placeholder.com/150'} 
            alt="Avatar" 
          />
        </div>
      </div>

      {/* Stats Dashboard */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {/* Earnings Card */}
          <div className="bg-gradient-to-br from-teal-500 via-emerald-500 to-green-600 rounded-3xl p-6 text-white shadow-lg shadow-emerald-500/10 hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute right-4 top-4 w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white/80 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xs uppercase tracking-widest font-extrabold opacity-80">Earnings</p>
            <p className="text-3xl font-black mt-3">₹{stats.earnings}</p>
            <p className="text-[10px] mt-4 font-semibold text-teal-100 bg-white/10 py-1 px-2.5 rounded-md inline-block">
              *From completed appointments
            </p>
          </div>

          {/* Appointments Card */}
          <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-500/10 hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute right-4 top-4 w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white/80 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-xs uppercase tracking-widest font-extrabold opacity-80">Appointments</p>
            <p className="text-3xl font-black mt-3">{stats.appointments}</p>
            <p className="text-[10px] mt-4 font-semibold text-indigo-100 bg-white/10 py-1 px-2.5 rounded-md inline-block">
              Total bookings booked
            </p>
          </div>

          {/* Patients Card */}
          <div className="bg-gradient-to-br from-violet-500 via-purple-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg shadow-purple-500/10 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute right-4 top-4 w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white/80 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-xs uppercase tracking-widest font-extrabold opacity-80">Unique Patients</p>
            <p className="text-3xl font-black mt-3">{stats.patients}</p>
            <p className="text-[10px] mt-4 font-semibold text-purple-100 bg-white/10 py-1 px-2.5 rounded-md inline-block">
              Clinic patient logs
            </p>
          </div>
        </div>
      )}

      {/* Dashboard Content Tabs */}
      <div className="border-b border-slate-100 mb-6 flex gap-4 text-sm font-medium">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`pb-4 px-2 border-b-2 transition-all duration-300 cursor-pointer ${
            activeTab === 'appointments' 
              ? 'border-indigo-600 text-indigo-600 font-bold' 
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Appointments List ({appointments.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-4 px-2 border-b-2 transition-all duration-300 cursor-pointer ${
            activeTab === 'profile' 
              ? 'border-indigo-600 text-indigo-600 font-bold' 
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Profile Settings
        </button>
      </div>

      {/* Tab Panel Content */}
      <div>
        {activeTab === 'appointments' && (
          <div className="glass-card border border-white/50 rounded-2xl overflow-hidden shadow-sm">
            <p className="px-6 py-4 font-bold text-gray-800 border-b border-slate-100 bg-slate-50/50">
              All Bookings
            </p>
            
            {appointments.length === 0 ? (
              <div className="text-center py-16 text-gray-400 font-medium">
                No appointments booked yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600 border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-gray-500 font-bold text-xs uppercase tracking-wider">
                      <th className="px-6 py-4">#</th>
                      <th className="px-6 py-4">Patient</th>
                      <th className="px-6 py-4">Date & Time</th>
                      <th className="px-6 py-4">Fees</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((item, index) => (
                      <tr className="border-b border-slate-100/60 hover:bg-slate-50/40 transition-all duration-200" key={item._id}>
                        <td className="px-6 py-4 font-bold text-gray-300">{index + 1}</td>
                        <td className="px-6 py-4 font-bold text-gray-800">
                          {item.userData?.name || 'Anonymous'}
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-gray-500">
                          {item.slotDate.replace(/_/g, '/')} | <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{item.slotTime}</span>
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-800">₹{item.amount}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 items-center">
                            {item.cancelled && (
                              <span className="px-3 py-1 rounded-full text-xs font-bold text-red-600 bg-red-50 border border-red-200/50">
                                Cancelled
                              </span>
                            )}
                            
                            {item.isCompleted && (
                              <span className="px-3 py-1 rounded-full text-xs font-bold text-green-600 bg-green-50 border border-green-200/50">
                                Completed
                              </span>
                            )}

                            {!item.cancelled && !item.isCompleted && (
                              <>
                                <button 
                                  onClick={() => cancelAppointment(item._id)}
                                  className="px-3 py-1.5 border border-rose-200 rounded-xl text-rose-600 hover:bg-rose-600 hover:text-white hover:border-transparent transition-all duration-300 cursor-pointer text-xs font-bold"
                                >
                                  Cancel
                                </button>
                                <button 
                                  onClick={() => completeAppointment(item._id)}
                                  className="px-3 py-1.5 bg-green-500 rounded-xl text-white hover:bg-green-600 shadow-md hover:shadow-green-100 transition-all duration-300 cursor-pointer text-xs font-bold"
                                >
                                  Complete
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && profileData && (
          <form onSubmit={saveProfileSettings} className="glass-card border border-white/50 rounded-2xl p-6 sm:p-8 shadow-sm max-w-2xl">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Edit Profile & Settings</h2>
            
            <div className="flex flex-col gap-6">
              {/* Availability Toggle */}
              <div className="flex items-center gap-3 bg-indigo-50/30 border border-indigo-100/50 p-4 rounded-2xl">
                <input 
                  type="checkbox" 
                  id="availability"
                  checked={profileData.available}
                  onChange={(e) => setProfileData(prev => ({ ...prev, available: e.target.checked }))}
                  className="w-5 h-5 accent-indigo-600 cursor-pointer rounded-md focus:ring-indigo-500"
                />
                <label htmlFor="availability" className="text-sm font-bold text-gray-700 cursor-pointer select-none">
                  Accepting Appointments (Available Online)
                </label>
              </div>

              {/* Fees */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Consultation Fees (₹)</label>
                <input 
                  type="number"
                  required
                  value={profileData.fees}
                  onChange={(e) => setProfileData(prev => ({ ...prev, fees: Number(e.target.value) }))}
                  className="bg-white/80 border border-slate-200 rounded-xl px-4 py-3 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none text-sm font-semibold text-gray-700 transition-all"
                />
              </div>

              {/* Bio/About */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">About / Biography</label>
                <textarea 
                  rows="4"
                  required
                  value={profileData.about}
                  onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))}
                  className="bg-white/80 border border-slate-200 rounded-xl px-4 py-3 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none text-sm font-medium text-gray-700 transition-all leading-relaxed"
                />
              </div>

              {/* Address */}
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Clinic Address</label>
                <input 
                  type="text"
                  placeholder="Address Line 1"
                  required
                  value={profileData.address?.line1 || ''}
                  onChange={(e) => setProfileData(prev => ({ 
                    ...prev, 
                    address: { ...prev.address, line1: e.target.value } 
                  }))}
                  className="bg-white/80 border border-slate-200 rounded-xl px-4 py-3 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none text-sm font-semibold text-gray-700 transition-all"
                />
                <input 
                  type="text"
                  placeholder="Address Line 2 (Optional)"
                  value={profileData.address?.line2 || ''}
                  onChange={(e) => setProfileData(prev => ({ 
                    ...prev, 
                    address: { ...prev.address, line2: e.target.value } 
                  }))}
                  className="bg-white/80 border border-slate-200 rounded-xl px-4 py-3 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none text-sm font-semibold text-gray-700 transition-all"
                />
              </div>

              {/* Save Button */}
              <button 
                type="submit" 
                disabled={isSavingProfile}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold py-3.5 rounded-xl mt-4 shadow-md hover:shadow-lg shadow-indigo-100 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 disabled:from-slate-200 disabled:to-slate-300 disabled:text-slate-400 disabled:shadow-none disabled:scale-100 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSavingProfile ? 'Saving Changes...' : 'Save Settings'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
