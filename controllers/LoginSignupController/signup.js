const loginDetails = require('../../models/allEntitiesDB');
const UserDetails = require('../../models/userRegisterationDB');
const sellerDetails = require('../../models/medicalShopRegistrationDB');
const {validationResult} = require('express-validator');
const {ObjectId} = require('mongodb');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const mailSender = require('../../utils/mailService/sendMail');
// const smsSender = require('../../utils/smsService/sendSMS');
const DB_Constants = require('../../DB_Names');
const devDBURI = require('../../utils/Connection');
const {MongoClient} = require('mongodb');

// varibales used
exports.getSignUpPage = (req,res,next)=>{
    return res.render('Login/customerSignup',{});
}
exports.destroySession=(session)=> {
    return new Promise((resolve, reject) => {
        session.destroy(err => {
            if (err) {
                reject(new Error('Failed to destroy session'));
            } else {
                resolve(true);
            }
        });
    });
}
let saveSession=(session)=> {
    return new Promise((resolve, reject) => {
        session.save(err => {
            if (err) {
                reject(new Error('Failed to save session'));
            } else {
                resolve(true);
            }
        });
    });
}

function deleteSessionItems(session){
    delete session.emailOTP;
    delete session.isEmailOtpVerified;
    delete session.expiryofEmailOtp;
    delete session.mobileNoOTP;
    delete session.expiryofMobileOtp;
    delete session.isMobileOtpVerified;
}

function OTPGenerator(){
    return Math.floor(Math.random()*100000);
}

//fixed
exports.emailOtpSession = async(req,res)=>{
    const {emailId} = req.body;
    const client =await MongoClient.connect(devDBURI.DB_Connections.DEV_URI);
    const db = client.db('devDB');
    const sessions = db.collection('sessions');
    const result = await sessions.findOne({'session.emailId':emailId});
    if(result){
        console.log('Session found updating it');
        const updateSession = {
            'session.emailOTP': OTPGenerator(),
            'session.expiryofEmailOtp': new Date(Date.now() + 15 * 60 * 1000),
        }
        return sessions.updateOne({'session.emailId':emailId}, {$set:updateSession}).then(async result=>{
            if(result){
                await mailSender.sendMail(emailId,updateSession['session.emailOTP']);
                return res.status(200).json({
                    success:true,
                    message:'Email OTP Generated Successfully !',
                });
            }else{
                throw new Error('Failed to update session');
            }
        }).catch((err)=>{
            console.log(err);
            return res.status(402).json({
                success:false,
                message:err.message,
            });
        })
    }else{
        console.log('session not found, creating it');
        req.session.emailOTP = OTPGenerator();
        req.session.emailId = emailId;
        req.session.isEmailOtpVerified = false;
        req.session.expiryofEmailOtp = new Date(Date.now() + 15*60*1000);
        return saveSession(req.session).then(async result=>{
            if(result){
                await mailSender.sendMail(req.session.emailId,req.session.emailOTP);
                return res.status(200).json({
                    success:true,
                    message:'Email OTP Generated Successfully !',
                });
            }else{
                throw new Error('Failed to create session');
            }
        }).catch((err)=>{
            console.log(err);
            return res.status(402).json({
                success:false,
                message:err.message,
            });
        })
    }
}
//working fine
exports.emailOtpValidation =async(req,res)=>{
    const {emailId,emailOtp} = req.body;
    const client =await MongoClient.connect(devDBURI.DB_Connections.DEV_URI);
    const db = client.db('devDB');
    const sessions = db.collection('sessions');
    const result = await sessions.findOne({'session.emailId':emailId});
    if(new Date(result.session.expiryofEmailOtp) > new Date()){
        if(result.session.emailOTP == emailOtp){
            const updateObj= {
                'session.isEmailOtpVerified' : true,
                'session.expiryofEmailOtp': null,
                'session.emailOTP' : null,
            };
            return sessions.updateOne({'session.emailId':emailId},{$set:updateObj}).then(result=>{
                if(result){
                    return res.status(200).json({
                        success:true,
                        message:'Email OTP Verified',
                    });
                }else{
                    res.status(404).json({
                        success:false,
                        message:'Failed to update session'
                    })
                }
            });
        }else{
            return  res.status(402).json({
                success:false,
                message:'Incorrect email OTP',
            })
        }
    }else{
        return res.status(200).json({
            success:false,
            message:'Email OTP expired. Create a new one'
        });
    }
}

// exports.mobileNumberOtpSession = async(req,res)=>{
//     console.log('entered here');
//     const {mobileNo,emailId} = req.body;
//     console.log(mobileNo,emailId);
//     const client =await MongoClient.connect(devDBURI.DB_Connections.DEV_URI);
//     const db = client.db('devDB');
//     const sessions = db.collection('sessions');
//     const result =await  sessions.findOne({'session.emailId':emailId,'session.mobileNo':mobileNo});
//     if(result){
//         // session exists update it
//         console.log('Mobile session found, updating it');
//         const updateSession = {
//             'session.mobileNoOTP' : OTPGenerator(),
//             'session.expiryofMobileOtp' : new Date(Date.now() + 15*60*1000),
//         }
//         return sessions.updateOne({'session.emailId':emailId,'session.mobileNo':mobileNo},{$set:updateSession}).then(async result=>{
//             if(result){
//                 await smsSender.sendSMS(mobileNo,updateSession['session.mobileNoOTP']);
//                 return res.status(200).json({
//                     success:true,
//                     message:'Mobile OTP Sent successfully',
//                 });
//             }else{
//                 throw new Error('Failed to update session');
//             }
//         }).catch(err=>{
//             return res.status(402).json({
//                 success:false,
//                 message:err.message,
//             })
//         });
//     }else{
//         console.log('mobile session not found, creating it');
//         const updateSession = {
//             'session.mobileNoOTP' : OTPGenerator(),
//             'session.mobileNo' : mobileNo,
//             'session.expiryofMobileOtp' : new Date(Date.now() + 15*60*1000),
//             'session.isMobileOtpVerified' : false,
//         }
//         return sessions.updateOne({'session.emailId':emailId},{$set:updateSession})
//         .then(async (res)=>{
//             console.log(res);
//             if(res){
//                 console.log(updateSession['session.mobileNo'],updateSession['session.mobileNoOTP']);
//                 await smsSender.sendSMS(updateSession['session.mobileNo'],updateSession['session.mobileNoOTP']);
//                 return res.status(200).json({
//                     success:false,
//                     message:'Mobile OTP Generated Successfully',
//                 });
//             }else{
//                 throw new Error('Failed to update Session');
//             }
//         }).catch(err=>{
//             return res.status(402).json({
//                 success:false,
//                 message: err.message
//             });
//         });
//     }
// }
// exports.mobileNumberOtpValidation = async(req,res)=>{
//     const {emailId,mobileNo,smsOtp} = req.body;
//     const client =await MongoClient.connect(devDBURI.DB_Connections.DEV_URI);
//     const db = client.db('devDB');
//     const sessions = db.collection('sessions');
//     const result = await sessions.findOne({'session.emailId':emailId,'session.mobileNo':mobileNo});
//     if(new Date(result.session.expiryofMobileOtp)> new Date()){
//         console.log('Ideal session exists, check for validation');
//         if(result.session.mobileNoOTP==smsOtp){
//             const updateSession = {
//                 'session.isMobileOtpVerified' : true,
//                 'session.expiryOfMobileOtp' : null,
//                 'session.mobileNoOTP':null,
//             }
//             return sessions.updateOne({'session.emailId':emailId,'session.mobileNo':mobileNo},{$set:updateSession}).then(async result=>{
//                 if(result){
//                     return res.status(200).json({
//                         success:true,
//                         message:'SMS OTP verified',
//                     });
//                 }else{
//                     throw new Error('Failed to update Session');
//                 }
//             }).catch(err=>{
//                 return res.status(402).json({
//                     success:false,
//                     message:err.message,
//                 }) 
//             })
//         }else{
//             return  res.status(402).json({
//                 success:false,
//                 message:'Incorrect SMS OTP',
//             });
//         }
//     }else{
//         return res.status(200).json({
//             success:false,
//             message:'SMS OTP expired. Create a new one'
//         });
//     }
// }


exports.postCustomerSignup = async (req,res,next)=>{
    const {customerName,emailId,mobileNo,password} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            success:false,
            message:errors.array()[0].msg,
        })
    }

    let transactionSession;
    // also validate whether the user already exists or not
    try{
        let isUserAlreadyPresent = await loginDetails.findOne({$or:[{emailId:emailId},{mobileNo:mobileNo}]});
        if(isUserAlreadyPresent){
            throw new Error('User Already exists. Please login');
        }
        const client =await MongoClient.connect(devDBURI.DB_Connections.DEV_URI);
        const db = client.db('devDB');
        const sessions = db.collection('sessions');
        const doesSessionExists = await sessions.findOne({'session.emailId':emailId});
        // the below logic will execute only when user does not exists
        if(doesSessionExists){
            if(!doesSessionExists.session.isEmailOtpVerified){
                throw new Error('OTP verification pending');
            }
        }else{
            throw new Error('Please validate emailId');
        }
        //below logic will only be executed if session exists and otp verification are done
        //create the entry 
        transactionSession = await mongoose.startSession();
        await transactionSession.startTransaction();
        const hashedPassword = await bcrypt.hash(password,12);
        const loginObj = await loginDetails.create({emailId:emailId,mobileNumber:Number(mobileNo),password:hashedPassword,roleId:1});
        if(!loginObj){
            throw new Error('Failed to create entry in login_info_db');
        }
        const userObj = await  UserDetails.create({emailId:new ObjectId(loginObj._id),mobileNumber:new ObjectId(loginObj._id),password:new ObjectId(loginObj._id),customerName:customerName});
        if(!userObj){
            throw new Error('Failed to create entry in user registration db');
        }
        loginObj.entityObject = new ObjectId(userObj._id);
        loginObj.entityModel = DB_Constants.USER_REGISTRATION_STORE_DB;

        const result = await loginObj.save();
        if(!result){
            throw new Error('Failed to register user into the database');
        }
        await transactionSession.commitTransaction();
        transactionSession.endSession();
        console.log('Successful signup');
        return res.status(200).json({
            success:true,
            message:'Successful Singup!!',
        })
    }catch(err){
        if(transactionSession){
            await transactionSession?.abortTransaction();
            transactionSession.endSession(); 
        }
        //redirect him into same page with an error message;
        
        return res.status(400).json({
            success:false,
            message:err.message,
        });
    };

};
exports.postSellerSignup = async (req,res,next)=>{
    // in future make an api call to validate the trueness of drug license number, gst registration number,fssai number

    //for now since the pattern of drug license number has already been validated and you will end up here if the validation is correct;

    const validationError = validationResult(req);
    if(validationError){
        return res.status(400).json({
            errorMessage:validationError.array()[0].msg,
            success:false,
        });
    }
    // this will only be executed if no validation errors are found.
    const {drugLicenseNumber,gstRegistrationNumber,fssaiLicenseNumber,emailId,mobileNo,password,addrL1,addrL2,addrL3,state,city,pincode,shopLatitute,shopLongitude,storeName,ownerName,shopLogo, pdfHeaderLogo, pdfFooterLogo,openTime,closeTime,daysOpen} = req.body;

    // will only end up here when required fields are not empty, in that case it will throw an error at the time of input validations only
    const hashedPassword = await bcrypt.hash(password,12);
    let transactionSession;
    try{
        //check whether the user already exists or not on the basis of drugLicense number, fssai number
        // here emailId and mobile number cannot be unique identifier as one customer can have two or more shop which he wants to register with the same emailId
        const isSellerAlreadyRegistered = await UserDetails.findOne({$or:[{drugLicenseNumber:drugLicenseNumber},{fssaiLicenseNumber:fssaiLicenseNumber}]});
        if(isSellerAlreadyRegistered){
            throw new Error('User already registered with provided Drug License Number or FSSAI Number');
        }
        // user is not registered, validate otps
        if(req.session && req.session.emailId==emailId && req.session.mobileNo==mobileNo){
            if(!req.session.isEmailOtpVerified || !req.session.isMobileOtpVerified){
                throw new Error('OTP verification pending');
            }else{
                deleteSessionItems(req.session);
            }
        }else{
            throw new Error('OTP expired. Please Re-validate OTP');
        }
        //otps are verified

        transactionSession = await mongoose.startSession();
        transactionSession.startTransaction();
        let loginObj,userObj;
        loginObj = await loginDetails.create({emailId:emailId,mobileNumber:mobileNo,password:hashedPassword,roleId:2});
        if(!loginObj){
            throw new Error('Failed to create entry in login_details_db');
        }

        const storeAddress = {
            addressStructure:{
                line1:addrL1,
                line2:addrL2,
                line3:addrL3,
                state:state,
                city:city,
                pincode:pincode
            },
            latitude:shopLatitute,
            longitude:shopLongitude
        }
        const storeDetails ={
            storeName:storeName,
            ownerName:ownerName,
            emailId: ObjectId(loginObj._id),
            password:ObjectId(loginObj._id),
            contactNumber: ObjectId(loginObj._id),
            logoDetails:{
                logo:shopLogo,
                headerLogo:pdfHeaderLogo,
                footerLogo:pdfFooterLogo,
            },
            openingHours :openTime,
            closingHours:closeTime,
            // need to fix this no need to have a db for it
            openOnDays:daysOpen,
        }
        userObj = await sellerDetails.create({drugLicenseNumber:drugLicenseNumber,gstRegistrationNumber:gstRegistrationNumber,fssaiLicenseNumber:fssaiLicenseNumber,storeAddress:storeAddress,storeDetails:storeDetails,'temporaryCart.items':[],'temporaryCart.totalPrice':0});
        if(!userObj){
            throw new Error('Failed to create entry in medicationShopRegistrationDB');
        }
        loginObj.entityObject = ObjectId(userObj._id);
        loginObj.entityModel = DB_Constants.MEDICAL_STORE_DB;
        await transactionSession.commitTransaction();
        transactionSession.endSession();
        return res.status(200).json({
            success:true,
            message:'SignUp Successful !!',
            redirectUrl:'/',
        })
    }catch(err){
        await transactionSession.abortTransaction();
        transactionSession.endSession();
        return res.status(400).json({
            errorMessage: err.message,
            success:false,
        })
    }
   
}

