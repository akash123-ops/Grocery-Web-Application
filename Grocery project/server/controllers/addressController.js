import Address from "../models/Address.js";

//ADD Address:/api/address/add
export const addAddress = async(req,res)=>{
    try{
        const {address, userId} = req.body
        await Address.create({...address, userId})
        res.json({success:true,message:"Address Added Successfully"})
    }catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
}

//Get Address:/api/address/list
export const getAddress = async(req,res)=>{
    try{
        const {userId} = req.body
        const address = await Address.find({userId})
        res.json({success:true,address})
    }catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
}

//Update Address:/api/address/:id
export const updateAddress = async(req,res)=>{
    try{
        const {id} = req.params;
        const {address} = req.body;
        await Address.findByIdAndUpdate(id, address);
        res.json({success:true,message:"Address Updated Successfully"})
    }catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
}

//Delete Address:/api/address/:id
export const deleteAddress = async(req,res)=>{
    try{
        const {id} = req.params;
        await Address.findByIdAndDelete(id);
        res.json({success:true,message:"Address Deleted Successfully"})
    }catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
}