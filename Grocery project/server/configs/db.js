import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("Database Connected"));
        await mongoose.connect(`${process.env.MONGODB_URL}/groceryweb`);
        await seedSellerAccount();
    } catch (error) {
        console.log(error.message);
    }
};

const seedSellerAccount = async () => {
    const sellerAccounts = [
        {
            email: process.env.SELLER_EMAIL || 'admin@example.com',
            password: process.env.SELLER_PASSWORD || 'admin123',
            name: process.env.SELLER_NAME || 'Seller Admin'
        },
        {
            email: 'seller@test.com',
            password: 'seller123',
            name: 'Test Seller'
        }
    ];

    try {
        for (const sellerAccount of sellerAccounts) {
            let existingSeller = await User.findOne({ email: sellerAccount.email });

            if (!existingSeller) {
                const hashedPassword = await bcrypt.hash(sellerAccount.password, 10);
                await User.create({
                    name: sellerAccount.name,
                    email: sellerAccount.email,
                    password: hashedPassword,
                    role: 'seller'
                });
                console.log('✅ Seeded seller account:', sellerAccount.email);
                continue;
            }

            if (existingSeller.role !== 'seller') {
                existingSeller.role = 'seller';
                existingSeller.password = await bcrypt.hash(sellerAccount.password, 10);
                await existingSeller.save();
                console.log('✅ Updated seller role:', sellerAccount.email);
            }
        }
    } catch (error) {
        console.log('❌ Seller seeding error:', error.message);
    }
};


export default connectDB;