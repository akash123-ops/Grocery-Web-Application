import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId:{type:String,required:true,ref:'User'},
    items:[{
        productId:{type:String,required:true,ref:'Product'},
        quantity:{type:Number,required:true},
    }],
    amount:{type:Number,required:true},
    address:{type:Object,required:true},
    status:{type:String,default:"Order Placed"},
    paymentType:{type:String,default:"COD"},
    isPaid:{type:Boolean,default:false},
},{timestamps:true})

const Order = mongoose.models.Order || mongoose.model('Order',orderSchema)

export default Order;