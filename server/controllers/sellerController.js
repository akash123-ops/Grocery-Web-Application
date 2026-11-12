import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const registerSeller = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existingSeller = await User.findOne({ email: normalizedEmail });
    if (existingSeller) {
      return res.status(409).json({ success: false, message: 'Seller already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const seller = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: 'seller'
    });

    const token = jwt.sign({ id: seller._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('sellerToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(201).json({
      success: true,
      message: 'Seller registered successfully',
      token,
      seller: { _id: seller._id, name: seller.name, email: seller.email, role: seller.role }
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

//Login Seller : /api/seller/login
export const loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const seller = await User.findOne({ email: normalizedEmail, role: 'seller' });

    if (!seller) {
      return res.status(401).json({ success: false, message: 'Invalid seller credentials' });
    }

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid seller credentials' });
    }

    const token = jwt.sign({ id: seller._id, email: seller.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('sellerToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({
      success: true,
      message: 'Seller logged in successfully',
      token,
      seller: { _id: seller._id, name: seller.name, email: seller.email, role: seller.role }
    });
  } catch (error) {
    console.error('Seller login error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

//Seller isAuth : /api/seller/is-auth
export const isSellerAuth = async (req, res) => {
  try {
    const seller = req.seller;
    if (!seller) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    return res.json({
      success: true,
      seller: { _id: seller._id, name: seller.name, email: seller.email, role: seller.role }
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

//logout seller :/api/seller/logout
export const sellerlogout = async (req, res) => {
  try {
    res.clearCookie('sellerToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
    });
    return res.json({ success: true, message: 'Logged Out' });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const sellerDashboard = async (req, res) => {
  try {
    const seller = req.seller;
    if (!seller) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    return res.json({
      success: true,
      message: 'Seller dashboard data loaded',
      dashboard: {
        seller: { _id: seller._id, name: seller.name, email: seller.email },
        stats: {
          revenue: 'Rs.24.8k',
          orders: 386,
          products: 142,
          customers: 1200
        }
      }
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
 