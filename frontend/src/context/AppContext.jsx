import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const currencySymbol = '₹';
    const backendUrl = "https://backend-pqmw.onrender.com"; // Local backend development server port

    const [doctors, setDoctors] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [userData, setUserData] = useState(false);
    const [dToken, setDToken] = useState(localStorage.getItem('dtoken') || '');
    const [aToken, setAToken] = useState(localStorage.getItem('atoken') || '');

    // Fetch all doctors from public API
    const getDoctorsData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
            if (data.success) {
                setDoctors(data.doctors);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    // Load logged-in user profile data
    const loadUserProfileData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
                headers: { token }
            });
            if (data.success) {
                setUserData(data.userData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    // Fetch doctors on load
    useEffect(() => {
        getDoctorsData();
    }, []);

    // Load user profile when token changes
    useEffect(() => {
        if (token) {
            loadUserProfileData();
        } else {
            setUserData(false);
        }
    }, [token]);

    const value = {
        doctors,
        getDoctorsData,
        currencySymbol,
        backendUrl,
        token,
        setToken,
        userData,
        setUserData,
        loadUserProfileData,
        dToken,
        setDToken,
        aToken,
        setAToken
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;