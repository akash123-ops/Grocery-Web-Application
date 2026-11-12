import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URL;

    if (!mongoUri) {
        throw new Error('MONGODB_URL is missing. Add it to server/.env before starting the backend.');
    }

    try {
        mongoose.connection.on('connected', () => console.log('Database Connected'));
        mongoose.connection.on('error', (error) => {
            console.error('MongoDB connection error:', error.message);
        });

        await mongoose.connect(mongoUri);
        await seedSellerAccount();
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        throw error;
    }
};

const seedSellerAccount = async () => {
    const sellerEmail = process.env.SELLER_EMAIL;
    const sellerPassword = process.env.SELLER_PASSWORD;

    if (!sellerEmail || !sellerPassword) {
        throw new Error('SELLER_EMAIL and SELLER_PASSWORD must be set in server/.env');
    }

    try {
        const existingSeller = await User.findOne({ email: sellerEmail.trim().toLowerCase() });

        if (!existingSeller) {
            const hashedPassword = await bcrypt.hash(sellerPassword, 10);
            await User.create({
                name: process.env.SELLER_NAME || 'Seller Admin',
                email: sellerEmail.trim().toLowerCase(),
                password: hashedPassword,
                role: 'seller'
            });
            console.log('✅ Seeded seller account:', sellerEmail.trim().toLowerCase());
            return;
        }

        if (existingSeller.role !== 'seller') {
            existingSeller.role = 'seller';
            existingSeller.password = await bcrypt.hash(sellerPassword, 10);
            await existingSeller.save();
            console.log('✅ Updated seller role:', existingSeller.email);
        }
    } catch (error) {
        console.error('❌ Seller seeding error:', error.message);
        throw error;
    }
};

export default connectDB;