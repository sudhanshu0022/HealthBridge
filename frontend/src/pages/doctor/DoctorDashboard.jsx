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
    <div className='min-h-[80vh] py-6'>
      {/* Top Banner */}
      <div className='flex justify-between items-center mb-8 bg-indigo-50 border border-indigo-100 rounded-2xl p-6'>
        <div>
          <h1 className='text-2xl font-bold text-indigo-900'>Welcome back, {profileData?.name || 'Doctor'}!</h1>
          <p className='text-sm text-indigo-600 mt-1'>{profileData?.speciality || 'Specialist'}</p>
        </div>
        <img 
          className='w-16 h-16 rounded-full object-cover border-2 border-indigo-400 bg-white' 
          src={profileData?.image || 'https://via.placeholder.com/150'} 
          alt="Avatar" 
        />
      </div>

      {/* Stats Dashboard */}
      {stats && (
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8'>
          {/* Earnings Card */}
          <div className='bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-md'>
            <p className='text-sm uppercase tracking-wider font-semibold opacity-80'>Earnings</p>
            <p className='text-3xl font-bold mt-2'>${stats.earnings}</p>
            <p className='text-xs mt-3 opacity-90'>*From completed appointments</p>
          </div>

          {/* Appointments Card */}
          <div className='bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-md'>
            <p className='text-sm uppercase tracking-wider font-semibold opacity-80'>Appointments</p>
            <p className='text-3xl font-bold mt-2'>{stats.appointments}</p>
            <p className='text-xs mt-3 opacity-90'>Total booked requests</p>
          </div>

          {/* Patients Card */}
          <div className='bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white shadow-md'>
            <p className='text-sm uppercase tracking-wider font-semibold opacity-80'>Unique Patients</p>
            <p className='text-3xl font-bold mt-2'>{stats.patients}</p>
            <p className='text-xs mt-3 opacity-90'>Patient database visits</p>
          </div>
        </div>
      )}

      {/* Dashboard Content Tabs */}
      <div className='border-b border-gray-200 mb-6 flex gap-4 text-sm font-medium'>
        <button
          onClick={() => setActiveTab('appointments')}
          className={`pb-4 px-2 border-b-2 transition-all cursor-pointer ${activeTab === 'appointments' ? 'border-indigo-600 text-indigo-600 font-semibold' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Appointments List ({appointments.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-4 px-2 border-b-2 transition-all cursor-pointer ${activeTab === 'profile' ? 'border-indigo-600 text-indigo-600 font-semibold' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Profile Settings
        </button>
      </div>

      {/* Tab Panel Content */}
      <div>
        {activeTab === 'appointments' && (
          <div className='bg-white border rounded-xl overflow-hidden shadow-sm'>
            <p className='px-6 py-4 font-semibold text-gray-800 border-b bg-gray-50/50'>All Appointments</p>
            
            {appointments.length === 0 ? (
              <div className='text-center py-12 text-gray-400'>
                No appointments booked yet.
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <table className='w-full text-left text-sm text-gray-600 border-collapse'>
                  <thead>
                    <tr className='bg-gray-50 border-b text-gray-700 font-medium'>
                      <th className='px-6 py-3'>#</th>
                      <th className='px-6 py-3'>Patient</th>
                      <th className='px-6 py-3'>Date & Time</th>
                      <th className='px-6 py-3'>Fees</th>
                      <th className='px-6 py-3 text-right'>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((item, index) => (
                      <tr className='border-b hover:bg-gray-50/50 transition-all' key={item._id}>
                        <td className='px-6 py-4 font-medium text-gray-400'>{index + 1}</td>
                        <td className='px-6 py-4 font-semibold text-gray-800'>
                          {item.userData?.name || 'Anonymous'}
                        </td>
                        <td className='px-6 py-4'>
                          {item.slotDate.replace(/_/g, '/')} | {item.slotTime}
                        </td>
                        <td className='px-6 py-4 font-semibold'>${item.amount}</td>
                        <td className='px-6 py-4 text-right flex justify-end gap-3'>
                          {item.cancelled && (
                            <span className='px-3 py-1 rounded-full text-xs font-semibold text-red-600 bg-red-50 border border-red-200'>
                              Cancelled
                            </span>
                          )}
                          
                          {item.isCompleted && (
                            <span className='px-3 py-1 rounded-full text-xs font-semibold text-green-600 bg-green-50 border border-green-200'>
                              Completed
                            </span>
                          )}

                          {!item.cancelled && !item.isCompleted && (
                            <>
                              <button 
                                onClick={() => cancelAppointment(item._id)}
                                className='px-3 py-1.5 border border-red-300 rounded text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer text-xs font-semibold'
                              >
                                Cancel
                              </button>
                              <button 
                                onClick={() => completeAppointment(item._id)}
                                className='px-3 py-1.5 bg-green-500 rounded text-white hover:bg-green-600 transition-all cursor-pointer text-xs font-semibold'
                              >
                                Complete
                              </button>
                            </>
                          )}
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
          <form onSubmit={saveProfileSettings} className='bg-white border rounded-xl p-6 shadow-sm max-w-2xl'>
            <h2 className='text-lg font-bold text-gray-800 mb-6'>Edit Profile & Settings</h2>
            
            <div className='flex flex-col gap-5'>
              {/* Availability Toggle */}
              <div className='flex items-center gap-3'>
                <input 
                  type="checkbox" 
                  id="availability"
                  checked={profileData.available}
                  onChange={(e) => setProfileData(prev => ({ ...prev, available: e.target.checked }))}
                  className='w-5 h-5 accent-indigo-600 cursor-pointer'
                />
                <label htmlFor="availability" className='text-sm font-semibold text-gray-700 cursor-pointer select-none'>
                  Accepting Appointments (Available Online)
                </label>
              </div>

              {/* Fees */}
              <div className='flex flex-col gap-1.5'>
                <label className='text-sm font-semibold text-gray-700'>Consultation Fees ($)</label>
                <input 
                  type="number"
                  required
                  value={profileData.fees}
                  onChange={(e) => setProfileData(prev => ({ ...prev, fees: Number(e.target.value) }))}
                  className='bg-gray-50 border border-gray-300 rounded p-2 focus:border-indigo-500 outline-none text-sm font-semibold text-gray-700'
                />
              </div>

              {/* Bio/About */}
              <div className='flex flex-col gap-1.5'>
                <label className='text-sm font-semibold text-gray-700'>About / Biography</label>
                <textarea 
                  rows="4"
                  required
                  value={profileData.about}
                  onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))}
                  className='bg-gray-50 border border-gray-300 rounded p-2 focus:border-indigo-500 outline-none text-sm text-gray-700'
                />
              </div>

              {/* Address */}
              <div className='flex flex-col gap-2'>
                <label className='text-sm font-semibold text-gray-700'>Clinic Address</label>
                <input 
                  type="text"
                  placeholder="Address Line 1"
                  required
                  value={profileData.address?.line1 || ''}
                  onChange={(e) => setProfileData(prev => ({ 
                    ...prev, 
                    address: { ...prev.address, line1: e.target.value } 
                  }))}
                  className='bg-gray-50 border border-gray-300 rounded p-2 focus:border-indigo-500 outline-none text-sm text-gray-700'
                />
                <input 
                  type="text"
                  placeholder="Address Line 2 (Optional)"
                  value={profileData.address?.line2 || ''}
                  onChange={(e) => setProfileData(prev => ({ 
                    ...prev, 
                    address: { ...prev.address, line2: e.target.value } 
                  }))}
                  className='bg-gray-50 border border-gray-300 rounded p-2 focus:border-indigo-500 outline-none text-sm text-gray-700'
                />
              </div>

              {/* Save Button */}
              <button 
                type="submit" 
                disabled={isSavingProfile}
                className='bg-indigo-600 text-white font-semibold py-2.5 rounded-lg mt-4 hover:bg-indigo-700 transition-all cursor-pointer disabled:bg-indigo-300'
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
