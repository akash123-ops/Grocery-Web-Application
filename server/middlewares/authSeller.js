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

        const seller = await User.findById(tokenDecoded.id).select('-password');
        if (!seller || seller.role !== 'seller') {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        req.seller = seller;
        return next();
    } catch (error) {
        console.log('authSeller middleware error:', error.message);
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

export default authSeller;
