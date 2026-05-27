import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('phone', userData.phone);
      formData.append('gender', userData.gender);
      formData.append('dob', userData.dob);
      formData.append('address', JSON.stringify(userData.address));
      
      if (image) {
        formData.append('image', image);
      }

      const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, formData, {
        headers: { token }
      });

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData(); // Reload latest details from backend
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  if (!userData) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-500 font-medium">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-sm">Loading Profile...</span>
      </div>
    );
  }

  return (
    <div className="animate-fade-in px-4 sm:px-10 max-w-2xl mx-auto my-8">
      <div className="glass-card border border-white/60 p-6 sm:p-10 rounded-3xl shadow-xl flex flex-col gap-6 text-slate-700">
        
        {/* Profile Picture & Header Area */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
          <div className="relative group">
            {isEdit ? (
              <label htmlFor="profileImage" className="cursor-pointer block relative rounded-2xl overflow-hidden shadow-md w-28 h-28 sm:w-32 sm:h-32 border-2 border-dashed border-indigo-400 hover:border-indigo-600 transition-all duration-300">
                <img
                  className="w-full h-full object-cover opacity-80"
                  src={image ? URL.createObjectURL(image) : userData.image}
                  alt="Profile"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Upload</span>
                </div>
                <input
                  type="file"
                  id="profileImage"
                  onChange={(e) => setImage(e.target.files[0])}
                  hidden
                />
              </label>
            ) : (
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shadow-lg border-2 border-white bg-slate-50">
                <img
                  className="w-full h-full object-cover"
                  src={userData.image || assets.profile_pic}
                  alt="Profile"
                />
              </div>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left">
            {isEdit ? (
              <input
                className="bg-white/80 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none text-2xl font-bold text-gray-900 rounded-xl px-3 py-1.5 w-full max-w-xs transition-all"
                type="text"
                value={userData.name}
                onChange={(e) =>
                  setUserData(prev => ({
                    ...prev,
                    name: e.target.value
                  }))
                }
                placeholder="Your Name"
              />
            ) : (
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                {userData.name}
              </h2>
            )}
            <p className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-wider">Patient Profile Card</p>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            Contact Information
          </h3>

          <div className="grid grid-cols-[1fr_2.5fr] gap-x-4 gap-y-4 text-sm items-center">
            <span className="font-semibold text-gray-500">Email Address:</span>
            <span className="text-indigo-600 font-medium">{userData.email}</span>

            <span className="font-semibold text-gray-500">Phone Number:</span>
            {isEdit ? (
              <input
                className="bg-white/80 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none rounded-xl px-3 py-2 w-full max-w-xs transition-all text-sm font-semibold"
                type="text"
                value={userData.phone}
                onChange={(e) =>
                  setUserData(prev => ({
                    ...prev,
                    phone: e.target.value
                  }))
                }
              />
            ) : (
              <span className="text-gray-800 font-medium">{userData.phone || 'Not Provided'}</span>
            )}

            <span className="font-semibold text-gray-500 self-start mt-1">Home Address:</span>
            {isEdit ? (
              <div className="flex flex-col gap-2 w-full max-w-sm">
                <input
                  className="bg-white/80 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none rounded-xl px-3 py-2 text-sm font-semibold transition-all"
                  type="text"
                  placeholder="Address Line 1"
                  value={userData.address?.line1 || ''}
                  onChange={(e) =>
                    setUserData(prev => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value }
                    }))
                  }
                />
                <input
                  className="bg-white/80 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none rounded-xl px-3 py-2 text-sm font-semibold transition-all"
                  type="text"
                  placeholder="Address Line 2"
                  value={userData.address?.line2 || ''}
                  onChange={(e) =>
                    setUserData(prev => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value }
                    }))
                  }
                />
              </div>
            ) : (
              <p className="text-gray-800 font-medium leading-relaxed">
                {userData.address?.line1 || 'No address set'}
                {userData.address?.line2 && <><br />{userData.address.line2}</>}
              </p>
            )}
          </div>
        </div>

        {/* Basic Information */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            Basic Information
          </h3>

          <div className="grid grid-cols-[1fr_2.5fr] gap-x-4 gap-y-4 text-sm items-center">
            <span className="font-semibold text-gray-500">Gender:</span>
            {isEdit ? (
              <select
                className="bg-white/80 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none rounded-xl px-3 py-2 w-full max-w-xs transition-all text-sm font-semibold"
                onChange={(e) =>
                  setUserData(prev => ({
                    ...prev,
                    gender: e.target.value
                  }))
                }
                value={userData.gender}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="not Selected">not Selected</option>
              </select>
            ) : (
              <span className="text-gray-800 font-medium">{userData.gender}</span>
            )}

            <span className="font-semibold text-gray-500">Birthday:</span>
            {isEdit ? (
              <input
                className="bg-white/80 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none rounded-xl px-3 py-2 w-full max-w-xs transition-all text-sm font-semibold"
                type="date"
                value={userData.dob}
                onChange={(e) =>
                  setUserData(prev => ({
                    ...prev,
                    dob: e.target.value
                  }))
                }
              />
            ) : (
              <span className="text-gray-800 font-medium">{userData.dob || 'Not Selected'}</span>
            )}
          </div>
        </div>

        {/* Save/Edit Actions */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => {
              if (isEdit) {
                updateUserProfileData();
              } else {
                setIsEdit(true);
              }
            }}
            className={`px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer ${
              isEdit 
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md hover:shadow-lg shadow-indigo-100 hover:scale-[1.02]' 
                : 'border border-indigo-200 text-indigo-600 bg-indigo-50/30 hover:bg-indigo-600 hover:text-white hover:border-transparent hover:scale-[1.01]'
            }`}
          >
            {isEdit ? 'Save Profile Details' : 'Edit Profile Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;