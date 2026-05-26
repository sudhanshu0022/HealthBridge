import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Doctors from './pages/doctors'
import About from './pages/about'
import Contact from './pages/contact'
import Login from './pages/login'
import MyProfile from './pages/myprofile'
import MyAppointment from './pages/myappointment'
import Appointment from './pages/appointment'
import DoctorLogin from './pages/doctor/DoctorLogin'
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/login' element={<Login />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/my-appointment' element={<MyAppointment />} />
        <Route path='/appointment/:docId' element={<Appointment />} />
        <Route path='/doctor-login' element={<DoctorLogin />} />
        <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
        <Route path='/admin-login' element={<AdminLogin />} />
        <Route path='/admin-dashboard' element={<AdminDashboard />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App