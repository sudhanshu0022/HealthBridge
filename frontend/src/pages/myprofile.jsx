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
        Loading Profile...
      </div>
    );
  }

  return (
    <div className='max-w-lg flex flex-col gap-2 text-sm'>
      {isEdit ? (
        <label htmlFor='profileImage' className="cursor-pointer">
          <div className='inline-block relative'>
            <img
              className='w-36 h-36 rounded object-cover opacity-75 border-2 border-dashed border-blue-400'
              src={image ? URL.createObjectURL(image) : userData.image}
              alt="Profile"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded text-white text-xs font-semibold">
              Click to Upload
            </div>
          </div>
          <input
            type="file"
            id="profileImage"
            onChange={(e) => setImage(e.target.files[0])}
            hidden
          />
        </label>
      ) : (
        <img
          className='w-36 h-36 rounded object-cover'
          src={userData.image || assets.profile_pic}
          alt="Profile"
        />
      )}

      {isEdit ? (
        <input
          className='bg-gray-50 text-3xl font-medium max-w-60 mt-4 border border-gray-300 rounded p-1'
          type="text"
          value={userData.name}
          onChange={(e) =>
            setUserData(prev => ({
              ...prev,
              name: e.target.value
            }))
          }
        />
      ) : (
        <p className='font-medium text-3xl text-neutral-800 mt-4'>
          {userData.name}
        </p>
      )}

      <hr className='bg-zinc-400 h-[1px] border-none' />

      <div>
        <p className='text-neutral-500 underline mt-3'>
          CONTACT INFORMATION
        </p>

        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Email:</p>
          <p className='text-blue-500'>{userData.email}</p>

          <p className='font-medium'>Phone:</p>
          {isEdit ? (
            <input
              className='bg-gray-100 max-w-52 border border-gray-300 rounded p-1'
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
            <p>{userData.phone}</p>
          )}

          <p className='font-medium'>Address:</p>
          {isEdit ? (
            <div className="flex flex-col gap-1.5 max-w-xs">
              <input
                className='bg-gray-100 border border-gray-300 rounded p-1'
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
                className='bg-gray-100 border border-gray-300 rounded p-1'
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
            <p>
              {userData.address?.line1 || 'Not Selected'}
              <br />
              {userData.address?.line2 || ''}
            </p>
          )}
        </div>
      </div>

      <div>
        <p className='text-neutral-500 underline mt-3'>
          BASIC INFORMATION
        </p>

        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Gender:</p>
          {isEdit ? (
            <select
              className='max-w-28 bg-gray-100 border border-gray-300 rounded p-1'
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
            <p>{userData.gender}</p>
          )}

          <p className='font-medium'>Birthday:</p>
          {isEdit ? (
            <input
              className='bg-gray-100 max-w-32 border border-gray-300 rounded p-1'
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
            <p>{userData.dob}</p>
          )}
        </div>
      </div>

      <button
        onClick={() => {
          if (isEdit) {
            updateUserProfileData();
          } else {
            setIsEdit(true);
          }
        }}
        className='border border-blue-500 px-8 py-2 rounded-full mt-5 hover:bg-blue-500 hover:text-white transition-all duration-300'
      >
        {isEdit ? 'Save Information' : 'Edit'}
      </button>
    </div>
  );
};

export default MyProfile;