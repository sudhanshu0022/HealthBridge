import express from 'express';
import { 
    loginDoctor, 
    appointmentsDoctor, 
    appointmentComplete, 
    appointmentCancel, 
    doctorProfile, 
    updateDoctorProfile, 
    doctorDashboard,
    doctorList 
} from '../controllers/doctorController.js';
import authDoctor from '../middlewares/authDoctor.js';

const doctorRouter = express.Router();

// Public routes
doctorRouter.post('/login', loginDoctor);
doctorRouter.get('/list', doctorList); // Unprotected route for user front-end to list all doctors

// Protected routes (require authDoctor middleware)
doctorRouter.get('/appointments', authDoctor, appointmentsDoctor);
doctorRouter.post('/complete-appointment', authDoctor, appointmentComplete);
doctorRouter.post('/cancel-appointment', authDoctor, appointmentCancel);
doctorRouter.get('/profile', authDoctor, doctorProfile);
doctorRouter.post('/update-profile', authDoctor, updateDoctorProfile);
doctorRouter.get('/dashboard', authDoctor, doctorDashboard);

export default doctorRouter;
