import express from 'express';
import { 
    addDoctor, 
    loginAdmin, 
    allDoctors, 
    changeAvailability, 
    appointmentsAdmin, 
    appointmentCancel, 
    adminDashboard 
} from '../controllers/admin.Controller.js';
import upload from '../middlewares/multer.js';
import authAdmin from '../middlewares/authAdmin.js';

const adminRouter = express.Router();

// Public route for admin login
adminRouter.post('/login', loginAdmin);

// Protected routes (require authAdmin middleware)
adminRouter.post('/add-doctor', authAdmin, upload.single('image'), addDoctor);
adminRouter.get('/all-doctors', authAdmin, allDoctors);
adminRouter.post('/change-availability', authAdmin, changeAvailability);
adminRouter.get('/appointments', authAdmin, appointmentsAdmin);
adminRouter.post('/cancel-appointment', authAdmin, appointmentCancel);
adminRouter.get('/dashboard', authAdmin, adminDashboard);

export default adminRouter;