import express from 'express';
import authUser from '../middlewares/authUser.js';
import { getCart, addToCart, updateCart, removeFromCart } from '../controllers/cartController.js';

const cartRoute = express.Router();

cartRoute.get('/', authUser, getCart);
cartRoute.post('/add', authUser, addToCart);
cartRoute.put('/update', authUser, updateCart);
cartRoute.delete('/remove', authUser, removeFromCart);

export default cartRoute;