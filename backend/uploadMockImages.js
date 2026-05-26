import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import dns from 'dns';
import path from 'path';
import fs from 'fs';
import 'dotenv/config';
import doctorModel from './models/doctorModel.js';

// Setup custom DNS mapping to support local MongoDB Atlas lookup
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

const uploadImagesAndSync = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB for updating doctor images...");

        // Fetch all doctors from database
        const doctors = await doctorModel.find({});
        if (doctors.length === 0) {
            console.log("No doctors found in the database. Please run seed.js first.");
            process.exit(1);
        }

        const assetsDir = path.resolve('../frontend/src/assets');
        console.log(`Scanning assets directory at: ${assetsDir}`);

        for (let i = 0; i < doctors.length; i++) {
            const doctor = doctors[i];
            
            // Map doctor to its local file number based on iteration or email name
            const index = i + 1; // doctor index 1 to 15
            const fileName = `doc${index}.png`;
            const filePath = path.join(assetsDir, fileName);

            if (fs.existsSync(filePath)) {
                console.log(`Uploading ${fileName} for ${doctor.name} to Cloudinary...`);
                
                const uploadResult = await cloudinary.uploader.upload(filePath, {
                    folder: 'doctor_profiles',
                    resource_type: 'image'
                });

                console.log(`Upload successful: ${uploadResult.secure_url}`);

                // Update database record
                await doctorModel.findByIdAndUpdate(doctor._id, {
                    image: uploadResult.secure_url
                });
                
                console.log(`Database record updated for ${doctor.name}.\n`);
            } else {
                console.warn(`File not found: ${filePath}`);
            }
        }

        console.log("All doctor image records have been updated successfully with live Cloudinary URLs!");
        process.exit(0);
    } catch (error) {
        console.error("Image upload and sync failed:", error);
        process.exit(1);
    }
};

uploadImagesAndSync();
