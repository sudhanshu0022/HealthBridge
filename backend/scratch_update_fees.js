import mongoose from 'mongoose';
import dns from 'dns';
import 'dotenv/config';
import doctorModel from './models/doctorModel.js';

dns.setServers(['8.8.8.8', '8.8.4.4']);

const updateFees = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected successfully!");

        const doctors = await doctorModel.find({});
        console.log(`Found ${doctors.length} doctors. Updating fees...`);

        let updatedCount = 0;
        for (const doc of doctors) {
            if (doc.fees < 100) {
                const oldFee = doc.fees;
                doc.fees = doc.fees * 10;
                await doc.save();
                console.log(`Updated ${doc.name}: ${oldFee} -> ${doc.fees}`);
                updatedCount++;
            } else {
                console.log(`Skipped ${doc.name} (Fee is already ${doc.fees})`);
            }
        }

        console.log(`Successfully updated ${updatedCount} doctor profiles!`);
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
};

updateFees();
