import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dns from 'dns';
import 'dotenv/config';
import doctorModel from './models/doctorModel.js';

dns.setServers(['8.8.8.8', '8.8.4.4']);

const mockDoctors = [
    {
        name: 'Dr. Richard James',
        email: 'richard@example.com',
        password: 'doctorpassword123',
        image: 'https://res.cloudinary.com/drsmbwnyq/image/upload/v1716634800/doc1.png',
        speciality: 'General physician',
        degree: 'MBBS',
        experience: 4,
        about: 'Dr. James has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '17th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        name: 'Dr. Emily Larson',
        email: 'emily@example.com',
        password: 'doctorpassword123',
        image: 'https://res.cloudinary.com/drsmbwnyq/image/upload/v1716634800/doc2.png',
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: 3,
        about: 'Dr. Larson has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 60,
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        name: 'Dr. Sarah Patel',
        email: 'sarah@example.com',
        password: 'doctorpassword123',
        image: 'https://res.cloudinary.com/drsmbwnyq/image/upload/v1716634800/doc3.png',
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: 1,
        about: 'Dr. Patel has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        address: {
            line1: '37th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        name: 'Dr. Christopher Lee',
        email: 'christopher@example.com',
        password: 'doctorpassword123',
        image: 'https://res.cloudinary.com/drsmbwnyq/image/upload/v1716634800/doc4.png',
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: 2,
        about: 'Dr. Lee has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 40,
        address: {
            line1: '47th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        name: 'Dr. Jennifer Garcia',
        email: 'jennifer@example.com',
        password: 'doctorpassword123',
        image: 'https://res.cloudinary.com/drsmbwnyq/image/upload/v1716634800/doc5.png',
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: 4,
        about: 'Dr. Garcia has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        name: 'Dr. Andrew Williams',
        email: 'andrew@example.com',
        password: 'doctorpassword123',
        image: 'https://res.cloudinary.com/drsmbwnyq/image/upload/v1716634800/doc6.png',
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: 4,
        about: 'Dr. Williams has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        name: 'Dr. Christopher Davis',
        email: 'davis@example.com',
        password: 'doctorpassword123',
        image: 'https://res.cloudinary.com/drsmbwnyq/image/upload/v1716634800/doc7.png',
        speciality: 'General physician',
        degree: 'MBBS',
        experience: 4,
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '17th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        name: 'Dr. Timothy White',
        email: 'timothy@example.com',
        password: 'doctorpassword123',
        image: 'https://res.cloudinary.com/drsmbwnyq/image/upload/v1716634800/doc8.png',
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: 3,
        about: 'Dr. White has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 60,
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        name: 'Dr. Ava Mitchell',
        email: 'ava@example.com',
        password: 'doctorpassword123',
        image: 'https://res.cloudinary.com/drsmbwnyq/image/upload/v1716634800/doc9.png',
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: 1,
        about: 'Dr. Mitchell has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        address: {
            line1: '37th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        name: 'Dr. Jeffrey King',
        email: 'jeffrey@example.com',
        password: 'doctorpassword123',
        image: 'https://res.cloudinary.com/drsmbwnyq/image/upload/v1716634800/doc10.png',
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: 2,
        about: 'Dr. King has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 40,
        address: {
            line1: '47th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        name: 'Dr. Zoe Kelly',
        email: 'zoe@example.com',
        password: 'doctorpassword123',
        image: 'https://res.cloudinary.com/drsmbwnyq/image/upload/v1716634800/doc11.png',
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: 4,
        about: 'Dr. Kelly has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        name: 'Dr. Patrick Harris',
        email: 'patrick@example.com',
        password: 'doctorpassword123',
        image: 'https://res.cloudinary.com/drsmbwnyq/image/upload/v1716634800/doc12.png',
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: 4,
        about: 'Dr. Harris has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        name: 'Dr. Chloe Evans',
        email: 'chloe@example.com',
        password: 'doctorpassword123',
        image: 'https://res.cloudinary.com/drsmbwnyq/image/upload/v1716634800/doc13.png',
        speciality: 'General physician',
        degree: 'MBBS',
        experience: 4,
        about: 'Dr. Evans has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '17th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        name: 'Dr. Ryan Martinez',
        email: 'ryan@example.com',
        password: 'doctorpassword123',
        image: 'https://res.cloudinary.com/drsmbwnyq/image/upload/v1716634800/doc14.png',
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: 3,
        about: 'Dr. Martinez has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 60,
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        name: 'Dr. Amelia Hill',
        email: 'amelia@example.com',
        password: 'doctorpassword123',
        image: 'https://res.cloudinary.com/drsmbwnyq/image/upload/v1716634800/doc15.png',
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: 1,
        about: 'Dr. Hill has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        address: {
            line1: '37th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB for seeding...");

        const count = await doctorModel.countDocuments();
        if (count > 0) {
            console.log(`The doctors collection already has ${count} records. Seeding skipped.`);
            process.exit(0);
        }

        console.log("Seeding doctors list into database...");
        
        // Hash passwords and seed
        const saltedPassword = await bcrypt.hash('doctorpassword123', 10);
        const doctorsToInsert = mockDoctors.map(doc => ({
            ...doc,
            password: saltedPassword
        }));

        await doctorModel.insertMany(doctorsToInsert);
        console.log("Database seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seedDB();
