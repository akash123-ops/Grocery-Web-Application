import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authSeller = async (req, res, next) => {
    const { sellerToken } = req.cookies;
    const authHeader = req.headers.authorization;

    let token = sellerToken;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
        const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!tokenDecoded?.id) {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }

        if (tokenDecoded.id === 'demo-seller') {
            const envEmail = process.env.SELLER_EMAIL?.trim().toLowerCase();
            req.seller = {
                _id: 'demo-seller',
                name: process.env.SELLER_NAME || 'Seller Admin',
                email: envEmail,
                role: 'seller'
            };
            return next();
        }

        try {
            const seller = await User.findById(tokenDecoded.id).select('-password');
            if (!seller || seller.role !== 'seller') {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }

            req.seller = seller;
            return next();
        } catch (dbError) {
            const envEmail = process.env.SELLER_EMAIL?.trim().toLowerCase();
            if (tokenDecoded.email === envEmail) {
                req.seller = {
                    _id: tokenDecoded.id,
                    name: process.env.SELLER_NAME || 'Seller Admin',
                    email: envEmail,
                    role: 'seller'
                };
                return next();
            }

            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
    } catch (error) {
        console.log('authSeller middleware error:', error.message);
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

export default authSeller;
