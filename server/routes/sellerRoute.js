import express from 'express';
import { loginSeller, registerSeller, isSellerAuth, sellerlogout, sellerDashboard } from '../controllers/sellerController.js';
import authSeller from '../middlewares/authSeller.js';

const sellerRouter = express.Router();

sellerRouter.post('/register', registerSeller);
sellerRouter.post('/login', loginSeller);
sellerRouter.get('/is-auth', authSeller, isSellerAuth);
sellerRouter.get('/dashboard', authSeller, sellerDashboard);
sellerRouter.get('/logout', sellerlogout);

export default sellerRouter;