import User from '../models/User.js';

//Get user cart:/api/cart/
export const getCart = async(req, res)=>{
    try{
        const userId = req.body.userId;
        const user = await User.findById(userId);
        res.json({success:true,cartItems:user.cartItems})
    } catch (error) {
        console.log(error.message)
        res.json({success:false,message:error.message})
    }
}

//Update user CartData:/api/cart/update
export const updateCart = async(req,res)=>{
    try{
        const {userId, cartItems}=req.body
        await User.findByIdAndUpdate(userId,{cartItems})
        res.json({success:true,message:"Cart updated successfully"})
    } catch (error) {
        console.log(error.message)
        res.json({success:false,message:error.message})
    }
}

//Add to cart:/api/cart/add
export const addToCart = async(req, res)=>{
    try{
        const {userId, productId, quantity} = req.body;
        const user = await User.findById(userId);
        const cartItems = user.cartItems || {};
        cartItems[productId] = (cartItems[productId] || 0) + quantity;
        await User.findByIdAndUpdate(userId, {cartItems});
        res.json({success:true,message:"Added to cart"})
    } catch (error) {
        console.log(error.message)
        res.json({success:false,message:error.message})
    }
}

//Remove from cart:/api/cart/remove
export const removeFromCart = async(req, res)=>{
    try{
        const {userId, productId} = req.body;
        const user = await User.findById(userId);
        const cartItems = user.cartItems || {};
        delete cartItems[productId];
        await User.findByIdAndUpdate(userId, {cartItems});
        res.json({success:true,message:"Removed from cart"})
    } catch (error) {
        console.log(error.message)
        res.json({success:false,message:error.message})
    }
}