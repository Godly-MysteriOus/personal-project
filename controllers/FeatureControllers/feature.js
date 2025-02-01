
const userQueryDB = require('../../models/userQueries');
const {validationResult} = require('express-validator');
const mongoose = require('mongoose');
exports.postUserQuery = async(req,res,next)=>{
    const error = validationResult(req);
    const {emailId,mobileNo,userMessage} = req.body;
    if(!error.isEmpty()){
        return res.status(400).json({
            success:false,
            message: error.array()[0].msg,
        });
    }
    let transactionSession;
    try{
        transactionSession = await mongoose.startSession();
        transactionSession.startTransaction();
        const createEntry = await userQueryDB.create({emailId:emailId,mobileNo:mobileNo,userMessage:userMessage});
        await transactionSession.commitTransaction();
        await transactionSession.endSession();
        if(!createEntry){
            throw new Error('Failed to raise concern');
        }
        return res.status(200).json({
            success:true,
            message:'Concern Raised Successfully',
        });
    }catch(err){
        await transactionSession.abortTransaction();
        await transactionSession.endSession();
        return res.status(400).json({
            success:false,
            message:err.message,
        });
    }
}