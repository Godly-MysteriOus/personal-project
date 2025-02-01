const loginDetails = require('../../models/allEntitiesDB');
const UserDetails = require('../../models/userRegisterationDB');
const sellerDetails = require('../../models/medicalShopRegistrationDB');
const sessionActions = require('./signup');
const {validationResult} = require('express-validator');
const {ObjectId} = require('mongodb');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');


exports.getLogin = (req,res,next)=>{
    return res.render('Login/login',{
        path:'/login',
    });
    // res.status(200).json({
    //     redirectUrl:'/login',
    //     success:false,
    // })
}
exports.postLogin =async (req,res)=>{
    const {credentialField,password} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
       return  res.status(200).json({
            message:errors.array()[0].msg,
            success:false,
            redirectUrl:'/login',
       });
    }
    let transactionSession= await mongoose.startSession();;
    try{
        transactionSession.startTransaction();
        const loginObj = await loginDetails.findOne({$or:[{emailId:credentialField},{mobileNumber:credentialField}]});
        if(!loginObj){
            throw new Error('Failed to find login credentials with provided credentials');
        }
        const isPasswordCorrect = await bcrypt.compare(password,loginObj.password).then(result=>result);
        if(!isPasswordCorrect){
            throw new Error('Invalid Username or Password');
        }
        let userObj;
        if(loginObj.roleId==1){
            userObj = await UserDetails.findOne({emailId:ObjectId(loginObj._id),mobileNumber:ObjectId(loginObj._id)});
        }else if(loginObj.roleId==2){
            userObj = await sellerDetails.findOne({'storeDetails.emailId':ObjectId(loginObj._id),'storeDetails.contactNumber':ObjectId(loginObj._id)});
        }else{
            throw new Error('Invalid Role Id');
        }
        await transactionSession.commitTransaction();
        await transactionSession.endSession();
        req.session.isLoggedIn = true,
        req.session.credentials = loginObj;
        req.session.user = userObj;
        await sessionActions.saveSession(req.session);
        return res.status(200).json({
            message:'Successfully Logged in',
            success:true,
            redirectUrl:'/seller/home',
        });
    }catch(err){
        transactionSession?.abortTransaction();
        await transactionSession.endSession();
        return res.status(400).json({
            message:err.message,
            success:false,
            redirectUrl:'/login',
        });
    }
}

exports.postLogout = async(req,res)=>{
    return sessionActions.destroySession(req.session)
    .then((result)=>{
        if(result){
            return res.status(200).json({
                message:'Logged out successfully',
                success:true,
            });    
        }else{
            return res.status(400).json({
                message:result
            })
        }
    });
};

exports.deleteUser = async(req,res)=>{
    let transactionSession;
    try {
        transactionSession = mongoose.startSession();
        (await transactionSession).startTransaction();
        if(req.user.roleId==1){
            const user = await UserDetails.deleteOne({emailId:ObjectId(req.user._id),mobileNumber:ObjectId(req.user._id)})
            if(!user){
                throw new Error('Failed to delete user record');
            }
        }else if(req.user.roleId==2){
            const seller = await sellerDetails.deleteOne({emailId:ObjectId(req.user._id),mobileNo:ObjectId(req.user._id)});
            if(!seller){
                throw new Error('Failed to delete seller record');
            }
        }
        const userCredentails = await loginDetails.deleteOne({emailId:req.user.emailId,mobileNumber:req.user.mobileNo});
        if(!userCredentails){
            throw new Error('Failed to delete user\'s login credentials');
        }
        (await transactionSession).commitTransaction();
        (await transactionSession).endSession();
        return destroySession(req.session).then(()=>res.redirect(''));
    } catch (error) {
        (await transactionSession).abortTransaction();
        (await transactionSession).endSession();
        return res.redirect('',{message:error.message});
    }
    
}