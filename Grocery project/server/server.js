import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudunary.js';
import productRouter from './routes/productRoute.js';
import cartRoute from './routes/cartRoute.js';
import addressRouter from './routes/addressRouter.js';
import orderRouter from './routes/orderRoute.js';


const app = express();
const port = process.env.PORT || 5000;

await connectDB();
await connectCloudinary();

//Allow multiple origins - include both frontend ports
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'];


//  Middleware CONFIGURATION
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.get('/',(req,res)=>res.send("API is Working"));
app.use('/api/user',userRouter)
app.use('/api/seller',sellerRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRoute)
app.use('/api/address',addressRouter)
app.use('/api/order',orderRouter)

app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})