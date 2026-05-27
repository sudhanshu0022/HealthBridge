import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { backendUrl, aToken, getDoctorsData } = useContext(AppContext);
  const navigate = useNavigate();

  // Active Tab
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'add-doctor', 'doctors', 'bookings'

  // States
  const [stats, setStats] = useState(null);
  const [allDocs, setAllDocs] = useState([]);
  const [allBookings, setAllBookings] = useState([]);

  // Add Doctor Form States
  const [docImage, setDocImage] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [speciality, setSpeciality] = useState('General physician');
  const [experience, setExperience] = useState('1 Year');
  const [fees, setFees] = useState('');
  const [about, setAbout] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');

  // Fetch Dashboard Stats
  const getAdminStats = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, {
        headers: { atoken: aToken }
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

  // Fetch All Doctors for Directory
  const getAdminDoctors = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/all-doctors`, {
        headers: { atoken: aToken }
      });
      if (data.success) {
        setAllDocs(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Fetch All Appointments
  const getAdminBookings = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/appointments`, {
        headers: { atoken: aToken }
      });
      if (data.success) {
        setAllBookings(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Toggle Doctor Availability
  const toggleDocAvailability = async (docId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/change-availability`, { docId }, {
        headers: { atoken: aToken }
      });
      if (data.success) {
        toast.success(data.message);
        getAdminDoctors();
        getDoctorsData(); // Sync landing page state
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Cancel Booking
  const cancelBooking = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/cancel-appointment`, { appointmentId }, {
        headers: { atoken: aToken }
      });
      if (data.success) {
        toast.success(data.message);
        getAdminBookings();
        getAdminStats();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Add New Doctor Submit Handler
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!docImage) {
      return toast.warning('Please select a doctor profile image');
    }

    try {
      const formData = new FormData();
      formData.append('image', docImage);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('speciality', speciality);
      formData.append('experience', experience.split(' ')[0]); // Convert "5 Years" to "5"
      formData.append('fees', Number(fees));
      formData.append('about', about);
      formData.append('address', JSON.stringify({ line1, line2 }));

      const { data } = await axios.post(`${backendUrl}/api/admin/add-doctor`, formData, {
        headers: { atoken: aToken }
      });

      if (data.success) {
        toast.success(data.message);
        // Reset form fields
        setDocImage(false);
        setName('');
        setEmail('');
        setPassword('');
        setFees('');
        setAbout('');
        setLine1('');
        setLine2('');
        getAdminDoctors();
        getDoctorsData();
        getAdminStats();
        setActiveTab('doctors'); // Redirect tab
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Auth Guard
  useEffect(() => {
    if (!aToken) {
      toast.warning('Please login to access Admin Dashboard');
      navigate('/admin-login');
    } else {
      getAdminStats();
      getAdminDoctors();
      getAdminBookings();
    }
  }, [aToken, navigate]);

  return (
    <div className="animate-fade-in px-4 sm:px-10 py-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-gradient-to-r from-red-500 via-rose-500 to-pink-600 border border-transparent rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-rose-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full filter blur-2xl translate-x-12 -translate-y-12"></div>
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-rose-400/20 rounded-full filter blur-xl translate-y-12"></div>

        <div className="relative z-10 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-black">Clinic Administrative Center</h1>
          <p className="text-sm text-rose-100 mt-1.5 font-medium bg-white/15 px-3 py-1 rounded-full inline-block">
            Healthbridge Head Officer Session
          </p>
        </div>
      </div>

      {/* Tab Menu Header */}
      <div className="border-b border-slate-100 mb-8 flex flex-wrap gap-2 text-sm font-semibold">
        {[
          { id: 'dashboard', label: 'Overview & Stats' },
          { id: 'add-doctor', label: 'Add Doctor Profile' },
          { id: 'doctors', label: `Doctors Directory (${allDocs.length})` },
          { id: 'bookings', label: `All Appointments (${allBookings.length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 px-3 border-b-2 transition-all duration-300 cursor-pointer ${
              activeTab === tab.id 
                ? 'border-rose-500 text-rose-600 font-bold' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div>
        {/* Overview Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {/* Total Doctors */}
              <div className="bg-gradient-to-br from-rose-500 via-pink-500 to-pink-600 rounded-3xl p-6 text-white shadow-lg shadow-rose-500/10 hover:shadow-xl hover:shadow-rose-500/20 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
                <p className="text-xs uppercase tracking-widest font-extrabold opacity-80">Total Doctors</p>
                <p className="text-3xl font-black mt-3">{stats.doctors}</p>
                <p className="text-[10px] mt-4 font-semibold text-rose-100 bg-white/10 py-1 px-2.5 rounded-md inline-block">
                  Verified practitioners
                </p>
              </div>

              {/* Total Bookings */}
              <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-500/10 hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
                <p className="text-xs uppercase tracking-widest font-extrabold opacity-80">Total Bookings</p>
                <p className="text-3xl font-black mt-3">{stats.appointments}</p>
                <p className="text-[10px] mt-4 font-semibold text-indigo-100 bg-white/10 py-1 px-2.5 rounded-md inline-block">
                  Appointments log history
                </p>
              </div>

              {/* Registered Patients */}
              <div className="bg-gradient-to-br from-teal-500 via-emerald-500 to-emerald-600 rounded-3xl p-6 text-white shadow-lg shadow-emerald-500/10 hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
                <p className="text-xs uppercase tracking-widest font-extrabold opacity-80">Registered Patients</p>
                <p className="text-3xl font-black mt-3">{stats.users}</p>
                <p className="text-[10px] mt-4 font-semibold text-emerald-100 bg-white/10 py-1 px-2.5 rounded-md inline-block">
                  Clinic patient logs
                </p>
              </div>
            </div>

            {/* Latest Bookings Log */}
            <div className="glass-card border border-white/50 rounded-2xl overflow-hidden shadow-sm">
              <p className="px-6 py-4 font-bold text-gray-800 border-b border-slate-100 bg-slate-50/50">
                Latest Booking Activity Logs
              </p>
              <div className="p-6 flex flex-col gap-4">
                {stats.latestAppointments.length === 0 ? (
                  <p className="text-gray-400 text-center py-6 font-medium">No bookings logged yet.</p>
                ) : (
                  stats.latestAppointments.map((item) => (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100/60 pb-4 last:border-0 last:pb-0 gap-4" key={item._id}>
                      <div className="flex items-center gap-3">
                        <img className="w-10 h-10 rounded-xl object-cover bg-slate-50 border border-slate-100 shadow-sm" src={item.docData?.image} alt="" />
                        <div>
                          <p className="text-gray-800 font-bold text-sm">{item.userData?.name || 'Anonymous'}</p>
                          <p className="text-xs text-gray-400">Assigned consultation with <span className="font-semibold text-rose-500">{item.docData?.name}</span></p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-semibold bg-slate-100 px-3 py-1 rounded-full border border-slate-200/50">
                          {item.slotDate.replace(/_/g, '/')} | {item.slotTime}
                        </span>
                        {item.cancelled ? (
                          <span className="text-[10px] text-red-600 bg-red-50 border border-red-200/50 px-2 py-0.5 rounded-md font-bold">Cancelled</span>
                        ) : item.isCompleted ? (
                          <span className="text-[10px] text-green-600 bg-green-50 border border-green-200/50 px-2 py-0.5 rounded-md font-bold">Completed</span>
                        ) : (
                          <span className="text-[10px] text-indigo-600 bg-indigo-50 border border-indigo-200/50 px-2 py-0.5 rounded-md font-bold">Active</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add Doctor Form Tab */}
        {activeTab === 'add-doctor' && (
          <form onSubmit={onSubmitHandler} className="glass-card border border-white/50 rounded-2xl p-6 sm:p-10 shadow-sm max-w-4xl">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Doctor Profile</h2>
            
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Side: Avatar selector */}
              <div className="flex flex-col items-center gap-3">
                <label htmlFor="docImage" className="cursor-pointer group block">
                  <div className="w-36 h-36 rounded-2xl border-2 border-dashed border-slate-200 group-hover:border-rose-400 flex flex-col items-center justify-center bg-slate-50 overflow-hidden relative transition-colors shadow-sm">
                    {docImage ? (
                      <>
                        <img className="w-full h-full object-cover" src={URL.createObjectURL(docImage)} alt="Doc preview" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                          Change
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-4 text-xs text-gray-400 flex flex-col items-center gap-1.5 font-bold">
                        <svg className="w-8 h-8 text-gray-300 group-hover:text-rose-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Upload Picture
                      </div>
                    )}
                  </div>
                </label>
                <input
                  type="file"
                  id="docImage"
                  onChange={(e) => setDocImage(e.target.files[0])}
                  hidden
                />
              </div>

              {/* Right Side: Fields */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Doctor Name</label>
                  <input className="bg-white/80 border border-slate-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-50 outline-none rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all" type="text" placeholder="Dr. John Smith" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Doctor Email</label>
                  <input className="bg-white/80 border border-slate-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-50 outline-none rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all" type="email" placeholder="john.smith@healthbridge.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Login Password</label>
                  <input className="bg-white/80 border border-slate-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-50 outline-none rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all" type="password" placeholder="Min 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Consultation Fees (₹)</label>
                  <input className="bg-white/80 border border-slate-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-50 outline-none rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all" type="number" placeholder="Fee in ₹" value={fees} onChange={(e) => setFees(e.target.value)} required />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Speciality</label>
                  <select className="bg-white/80 border border-slate-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-50 outline-none rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all cursor-pointer" value={speciality} onChange={(e) => setSpeciality(e.target.value)}>
                    <option value="General physician">General physician</option>
                    <option value="Gynecologist">Gynecologist</option>
                    <option value="Dermatologist">Dermatologist</option>
                    <option value="Cardiologist">Cardiologist</option>
                    <option value="Neurologist">Neurologist</option>
                    <option value="Pediatrician">Pediatrician</option>
                  </select>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Experience</label>
                  <select className="bg-white/80 border border-slate-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-50 outline-none rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all cursor-pointer" value={experience} onChange={(e) => setExperience(e.target.value)}>
                    <option value="1 Year">1 Year</option>
                    <option value="2 Years">2 Years</option>
                    <option value="3 Years">3 Years</option>
                    <option value="5 Years">5 Years</option>
                    <option value="8 Years">8 Years</option>
                    <option value="10+ Years">10+ Years</option>
                  </select>
                </div>
                
                <div className="flex flex-col gap-3 sm:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Clinic Address</label>
                  <input className="bg-white/80 border border-slate-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-50 outline-none rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all" type="text" placeholder="Address Line 1" value={line1} onChange={(e) => setLine1(e.target.value)} required />
                  <input className="bg-white/80 border border-slate-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-50 outline-none rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all" type="text" placeholder="Address Line 2 (Optional)" value={line2} onChange={(e) => setLine2(e.target.value)} />
                </div>
                
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">About / Bio</label>
                  <textarea className="bg-white/80 border border-slate-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-50 outline-none rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 transition-all leading-relaxed" rows="4" placeholder="Write biography details about the doctor" value={about} onChange={(e) => setAbout(e.target.value)} required />
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold py-3.5 rounded-xl mt-8 shadow-md hover:shadow-lg shadow-rose-100 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 cursor-pointer">
              Register Doctor Profile
            </button>
          </form>
        )}

        {/* Doctors List Tab */}
        {activeTab === 'doctors' && (
          <div className="glass-card border border-white/50 rounded-2xl overflow-hidden shadow-sm">
            <p className="px-6 py-4 font-bold text-gray-800 border-b border-slate-100 bg-slate-50/50">Registered Doctor Database</p>
            {allDocs.length === 0 ? (
              <p className="text-center py-16 text-gray-400 font-medium">No doctors registered.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
                {allDocs.map((item) => (
                  <div className="group border border-slate-100 rounded-2xl overflow-hidden bg-white hover:shadow-md transition-all duration-300 flex flex-col justify-between" key={item._id}>
                    <div className="relative overflow-hidden bg-slate-50 h-44">
                      <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={item.image} alt={item.name} />
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.available ? 'bg-green-500 text-white' : 'bg-slate-400 text-white'
                        }`}>
                          {item.available ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-gray-900 font-bold text-sm truncate">{item.name}</p>
                        <p className="text-[10px] text-indigo-600 font-semibold uppercase tracking-wider mt-0.5">{item.speciality}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 border-t border-slate-100 pt-3 text-xs">
                        <span className="text-gray-500 font-semibold">Active Status:</span>
                        <input
                          type="checkbox"
                          checked={item.available}
                          onChange={() => toggleDocAvailability(item._id)}
                          className="w-4 h-4 accent-rose-600 cursor-pointer rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bookings List Tab */}
        {activeTab === 'bookings' && (
          <div className="glass-card border border-white/50 rounded-2xl overflow-hidden shadow-sm">
            <p className="px-6 py-4 font-bold text-gray-800 border-b border-slate-100 bg-slate-50/50">All System Bookings</p>
            
            {allBookings.length === 0 ? (
              <div className="text-center py-16 text-gray-400 font-medium">No booking records found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600 border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-gray-500 font-bold text-xs uppercase tracking-wider">
                      <th className="px-6 py-4">#</th>
                      <th className="px-6 py-4">Patient</th>
                      <th className="px-6 py-4">Doctor Assigned</th>
                      <th className="px-6 py-4">Slot Date & Time</th>
                      <th className="px-6 py-4">Fee</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allBookings.map((item, index) => (
                      <tr className="border-b border-slate-100/60 hover:bg-slate-50/40 transition-all duration-200" key={item._id}>
                        <td className="px-6 py-4 font-bold text-gray-300">{index + 1}</td>
                        <td className="px-6 py-4 font-bold text-gray-800">{item.userData?.name || 'Anonymous'}</td>
                        <td className="px-6 py-4 font-medium text-gray-600">{item.docData?.name}</td>
                        <td className="px-6 py-4 text-xs font-semibold text-gray-500">
                          {item.slotDate.replace(/_/g, '/')} | <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{item.slotTime}</span>
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-800">₹{item.amount}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 items-center">
                            {item.cancelled ? (
                              <span className="px-3 py-1 rounded-full text-xs font-bold text-red-600 bg-red-50 border border-red-200/50">
                                Cancelled
                              </span>
                            ) : item.isCompleted ? (
                              <span className="px-3 py-1 rounded-full text-xs font-bold text-green-600 bg-green-50 border border-green-200/50">
                                Completed
                              </span>
                            ) : (
                              <button
                                onClick={() => cancelBooking(item._id)}
                                className="px-3 py-1.5 border border-rose-200 rounded-xl text-rose-600 hover:bg-rose-600 hover:text-white hover:border-transparent transition-all duration-300 cursor-pointer text-xs font-bold"
                              >
                                Cancel Appointment
                              </button>
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
      </div>
    </div>
  );
};

export default AdminDashboard;
