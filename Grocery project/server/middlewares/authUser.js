

import jwt from 'jsonwebtoken';

const authUser = (req, res, next) => {
    const {token} = req.cookies;
    if(!token){
        return res.json({success:false,message:'Unauthorized'})
    }   
    try{
        // Verify token here
        const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
        if(tokenDecoded.id){
            req.body.userId = tokenDecoded.id;
        }else{
            return res.json({success:false,message:'Unauthorized'})
        }
        next();
    } catch(error){
        res.json({success:false,message:error.message});
    }
}
export default authUser;