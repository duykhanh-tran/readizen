import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './src/lib/db.js';

dotenv.config();

const run = async () => {
    try {
        console.log("Connecting to Database...");
        await connectDB();
        console.log("Dropping index on userbookmarks...");
        const db = mongoose.connection.db;
        const result = await db.collection('userbookmarks').dropIndexes();
        console.log("Dropped indexes successfully:", result);
    } catch (e) {
        console.error("Error dropping index:", e);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from database.");
    }
};

run();
