import express from 'express';
import { upload } from '../configs/multer.js';
import authSeller from '../middlewares/authSeller.js';
import { addProduct, ProductList, ProductById, ChangeStock } from '../controllers/productControllers.js';

const productRouter = express.Router();

productRouter.post('/add', upload.array('images', 5), authSeller, addProduct);
productRouter.get('/list', ProductList);
productRouter.get('/:id', ProductById);
productRouter.post('/stock', authSeller, ChangeStock);

export default productRouter;