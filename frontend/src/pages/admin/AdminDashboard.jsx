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
    <div className='min-h-[85vh] py-6'>
      {/* Tab Menu Header */}
      <div className='border-b border-gray-200 mb-8 flex flex-wrap gap-4 text-sm font-semibold'>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`pb-4 px-2 border-b-2 transition-all cursor-pointer ${activeTab === 'dashboard' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Overview & Stats
        </button>
        <button
          onClick={() => setActiveTab('add-doctor')}
          className={`pb-4 px-2 border-b-2 transition-all cursor-pointer ${activeTab === 'add-doctor' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Add Doctor
        </button>
        <button
          onClick={() => setActiveTab('doctors')}
          className={`pb-4 px-2 border-b-2 transition-all cursor-pointer ${activeTab === 'doctors' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Doctors Directory ({allDocs.length})
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-4 px-2 border-b-2 transition-all cursor-pointer ${activeTab === 'bookings' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          All Appointments ({allBookings.length})
        </button>
      </div>

      {/* Tab Contents */}
      <div>
        {/* Overview Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
          <div>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8'>
              <div className='bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 text-white shadow-md'>
                <p className='text-sm uppercase tracking-wider font-semibold opacity-85'>Total Doctors</p>
                <p className='text-3xl font-bold mt-2'>{stats.doctors}</p>
              </div>
              <div className='bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl p-6 text-white shadow-md'>
                <p className='text-sm uppercase tracking-wider font-semibold opacity-85'>Total Bookings</p>
                <p className='text-3xl font-bold mt-2'>{stats.appointments}</p>
              </div>
              <div className='bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl p-6 text-white shadow-md'>
                <p className='text-sm uppercase tracking-wider font-semibold opacity-85'>Registered Patients</p>
                <p className='text-3xl font-bold mt-2'>{stats.users}</p>
              </div>
            </div>

            {/* Latest Bookings Log */}
            <div className='bg-white border rounded-xl overflow-hidden shadow-sm'>
              <p className='px-6 py-4 font-semibold text-gray-800 border-b bg-gray-50/50'>Latest Booking Logs</p>
              <div className='p-6 flex flex-col gap-4'>
                {stats.latestAppointments.length === 0 ? (
                  <p className='text-gray-400 text-center'>No bookings found.</p>
                ) : (
                  stats.latestAppointments.map((item, index) => (
                    <div className='flex items-center justify-between border-b pb-3 last:border-0 last:pb-0' key={item._id}>
                      <div className='flex items-center gap-3'>
                        <img className='w-10 h-10 rounded-full object-cover bg-gray-100' src={item.docData?.image} alt="" />
                        <div>
                          <p className='text-gray-800 font-semibold text-sm'>{item.userData?.name}</p>
                          <p className='text-xs text-gray-500'>Booked with {item.docData?.name}</p>
                        </div>
                      </div>
                      <p className='text-xs text-gray-600 font-semibold bg-gray-100 px-3 py-1 rounded-full'>
                        {item.slotDate.replace(/_/g, '/')} | {item.slotTime}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add Doctor Form Tab */}
        {activeTab === 'add-doctor' && (
          <form onSubmit={onSubmitHandler} className='bg-white border rounded-xl p-6 shadow-sm max-w-4xl'>
            <h2 className='text-xl font-bold text-gray-800 mb-6'>Add New Doctor Profile</h2>
            
            <div className='flex flex-col sm:flex-row gap-8'>
              {/* Left Side: Avatar selector */}
              <div className='flex flex-col items-center gap-2'>
                <label htmlFor="docImage" className='cursor-pointer'>
                  <div className='w-36 h-36 rounded-full border-2 border-dashed border-red-300 flex flex-col items-center justify-center bg-gray-50 overflow-hidden relative'>
                    {docImage ? (
                      <img className='w-full h-full object-cover' src={URL.createObjectURL(docImage)} alt="Doc preview" />
                    ) : (
                      <div className='text-center p-4 text-xs text-gray-500'>
                        <span className='text-3xl block mb-1'>📷</span>
                        Upload Doctor Picture
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
              <div className='flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='flex flex-col gap-1.5'>
                  <label className='text-xs font-bold text-gray-600 uppercase'>Doctor Name</label>
                  <input className='border border-gray-300 rounded p-2 text-sm outline-none focus:border-red-500' type="text" placeholder="Dr. John Smith" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className='flex flex-col gap-1.5'>
                  <label className='text-xs font-bold text-gray-600 uppercase'>Doctor Email</label>
                  <input className='border border-gray-300 rounded p-2 text-sm outline-none focus:border-red-500' type="email" placeholder="john.smith@clinic.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className='flex flex-col gap-1.5'>
                  <label className='text-xs font-bold text-gray-600 uppercase'>Login Password</label>
                  <input className='border border-gray-300 rounded p-2 text-sm outline-none focus:border-red-500' type="password" placeholder="Min 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className='flex flex-col gap-1.5'>
                  <label className='text-xs font-bold text-gray-600 uppercase'>Consultation Fees ($)</label>
                  <input className='border border-gray-300 rounded p-2 text-sm outline-none focus:border-red-500' type="number" placeholder="Fee amount" value={fees} onChange={(e) => setFees(e.target.value)} required />
                </div>
                <div className='flex flex-col gap-1.5'>
                  <label className='text-xs font-bold text-gray-600 uppercase'>Speciality</label>
                  <select className='border border-gray-300 rounded p-2 text-sm outline-none focus:border-red-500' value={speciality} onChange={(e) => setSpeciality(e.target.value)}>
                    <option value="General physician">General physician</option>
                    <option value="Gynecologist">Gynecologist</option>
                    <option value="Dermatologist">Dermatologist</option>
                    <option value="Pediatricians">Pediatricians</option>
                    <option value="Neurologist">Neurologist</option>
                    <option value="Gastroenterologist">Gastroenterologist</option>
                  </select>
                </div>
                <div className='flex flex-col gap-1.5'>
                  <label className='text-xs font-bold text-gray-600 uppercase'>Experience</label>
                  <select className='border border-gray-300 rounded p-2 text-sm outline-none focus:border-red-500' value={experience} onChange={(e) => setExperience(e.target.value)}>
                    <option value="1 Year">1 Year</option>
                    <option value="2 Years">2 Years</option>
                    <option value="3 Years">3 Years</option>
                    <option value="5 Years">5 Years</option>
                    <option value="8 Years">8 Years</option>
                    <option value="10+ Years">10+ Years</option>
                  </select>
                </div>
                <div className='flex flex-col gap-1.5 sm:col-span-2'>
                  <label className='text-xs font-bold text-gray-600 uppercase'>Clinic Address</label>
                  <input className='border border-gray-300 rounded p-2 text-sm outline-none focus:border-red-500 mb-2' type="text" placeholder="Address Line 1" value={line1} onChange={(e) => setLine1(e.target.value)} required />
                  <input className='border border-gray-300 rounded p-2 text-sm outline-none focus:border-red-500' type="text" placeholder="Address Line 2 (Optional)" value={line2} onChange={(e) => setLine2(e.target.value)} />
                </div>
                <div className='flex flex-col gap-1.5 sm:col-span-2'>
                  <label className='text-xs font-bold text-gray-600 uppercase'>About / Bio</label>
                  <textarea className='border border-gray-300 rounded p-2 text-sm outline-none focus:border-red-500' rows="4" placeholder="Write description about the doctor" value={about} onChange={(e) => setAbout(e.target.value)} required />
                </div>
              </div>
            </div>

            <button type="submit" className='w-full bg-red-600 text-white font-semibold py-3 rounded-lg mt-8 hover:bg-red-700 transition-all cursor-pointer'>
              Save & Add Doctor
            </button>
          </form>
        )}

        {/* Doctors List Tab */}
        {activeTab === 'doctors' && (
          <div className='bg-white border rounded-xl overflow-hidden shadow-sm'>
            <p className='px-6 py-4 font-semibold text-gray-800 border-b bg-gray-50/50'>Registered Doctors</p>
            {allDocs.length === 0 ? (
              <p className='text-center py-12 text-gray-400'>No doctors registered.</p>
            ) : (
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-6'>
                {allDocs.map((item) => (
                  <div className='border border-gray-200 rounded-xl overflow-hidden' key={item._id}>
                    <img className='bg-blue-50 w-full h-44 object-cover' src={item.image} alt={item.name} />
                    <div className='p-4'>
                      <p className='text-gray-900 font-semibold text-base'>{item.name}</p>
                      <p className='text-xs text-gray-500 mt-0.5'>{item.speciality}</p>
                      
                      <div className='flex items-center justify-between mt-4 border-t pt-3'>
                        <span className='text-xs text-gray-600 font-medium'>Availability Status:</span>
                        <input
                          type="checkbox"
                          checked={item.available}
                          onChange={() => toggleDocAvailability(item._id)}
                          className='w-4 h-4 accent-red-600 cursor-pointer'
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
          <div className='bg-white border rounded-xl overflow-hidden shadow-sm'>
            <p className='px-6 py-4 font-semibold text-gray-800 border-b bg-gray-50/50'>All System Appointments</p>
            
            {allBookings.length === 0 ? (
              <div className='text-center py-12 text-gray-400'>No booking records.</div>
            ) : (
              <div className='overflow-x-auto'>
                <table className='w-full text-left text-sm text-gray-600 border-collapse'>
                  <thead>
                    <tr className='bg-gray-50 border-b text-gray-700 font-medium'>
                      <th className='px-6 py-3'>#</th>
                      <th className='px-6 py-3'>Patient</th>
                      <th className='px-6 py-3'>Doctor Assigned</th>
                      <th className='px-6 py-3'>Slot Time</th>
                      <th className='px-6 py-3'>Fee</th>
                      <th className='px-6 py-3 text-right'>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allBookings.map((item, index) => (
                      <tr className='border-b hover:bg-gray-50/50' key={item._id}>
                        <td className='px-6 py-4 text-gray-400'>{index + 1}</td>
                        <td className='px-6 py-4 font-semibold text-gray-800'>{item.userData?.name}</td>
                        <td className='px-6 py-4'>{item.docData?.name}</td>
                        <td className='px-6 py-4'>{item.slotDate.replace(/_/g, '/')} | {item.slotTime}</td>
                        <td className='px-6 py-4 font-semibold'>${item.amount}</td>
                        <td className='px-6 py-4 text-right flex justify-end gap-3'>
                          {item.cancelled ? (
                            <span className='px-3 py-1 rounded-full text-xs font-semibold text-red-600 bg-red-50 border border-red-200'>
                              Cancelled
                            </span>
                          ) : item.isCompleted ? (
                            <span className='px-3 py-1 rounded-full text-xs font-semibold text-green-600 bg-green-50 border border-green-200'>
                              Completed
                            </span>
                          ) : (
                            <button
                              onClick={() => cancelBooking(item._id)}
                              className='px-3 py-1.5 border border-red-300 rounded text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer text-xs font-semibold'
                            >
                              Cancel Booking
                            </button>
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
      </div>
    </div>
  );
};

export default AdminDashboard;
