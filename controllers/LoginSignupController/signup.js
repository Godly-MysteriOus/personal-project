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
const {cloudinary} = require('../../utils/cloudinary');
// varibales used


exports.getSignUpPage = (req,res,next)=>{
    return res.render('Login/customerSignup',{
        path:'/customer-signup',
    });
}
exports.getSellerSignupPage = (req,res,next)=>{
    return res.render('Login/sellerSignup',{
        path:'/seller-signup'
    });
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

function OTPGenerator(){
    return Number(Math.floor(Math.random()*100000000).toString().substring(0,5));
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
        console.log(req.session?.credentials);
        if(req.session?.credentials){
            delete req.session.credentials;
            delete req.session.isLoggedIn;
            delete req.session.roleId;
            delete req.session.user;
        }
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
            let message = "";
            if(err.message == 'Failed to update session'){
                message = err.message;
            }else{
                console.log(err.message,err.stack);
                message = 'Error Occoured ! Try Again.';                
            }
            return res.status(402).json({
                success:false,
                message:message,
            });
        })
    }else{
        console.log('session not found, creating it');
        console.log(req.session?.credentials);
        if(req.session?.credentials){
            delete req.session.credentials;
            delete req.session.isLoggedIn;
            delete req.session.roleId;
            delete req.session.user;
        }
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
            let message = "";
            if(err.message == 'Failed to update session'){
                message = err.message;
            }else{
                console.log(err.message,err.stack);
                message = 'Error Occoured ! Try Again.';                
            }
            return res.status(402).json({
                success:false,
                message:message,
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
            return  res.status(400).json({
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
    let transactionSession = await mongoose.startSession();
    transactionSession.startTransaction();
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
        const hashedPassword = await bcrypt.hash(password,12);
        const loginObj = await loginDetails.create({emailId:emailId,mobileNumber:Number(mobileNo),password:hashedPassword,roleId:1,userAddresses:[],activeAddress:{}});
        if(!loginObj){
            console.log('Failed to create entry in login_info_db');
            throw new Error('Failed to create user');
        }
        const userObj = await  UserDetails.create({emailId:new ObjectId(loginObj._id),mobileNumber:new ObjectId(loginObj._id),password:new ObjectId(loginObj._id),customerName:customerName});
        if(!userObj){
            console.log('Failed to create entry in user_registration_db');
            throw new Error('Failed to create user');
        }
        loginObj.entityObject = new ObjectId(userObj._id);
        loginObj.entityModel = DB_Constants.USER_REGISTRATION_STORE_DB;
        const result = await loginObj.save();
        if(!result){
            console.log('Failed to register user into the database');
            throw new Error('Failed to create user');
        }
        await sessions.deleteOne({'session.emailId': emailId});
        await transactionSession.commitTransaction();
        transactionSession.endSession();
        return res.status(200).json({
            success:true,
            message:'Successful Signup!!',
        })
    }catch(err){
        let message = "";
        if(err.message == 'User Already exists. Please login' ||err.message == 'OTP verification pending' ||err.message == 'Please validate emailId' ||err.message == 'Failed to create user'){
            message = err.message;
        }else{
            console.log(err.message,err.stack);
            message = 'Error Occoured ! Try Again.'; 
        }
        await transactionSession?.abortTransaction();
        transactionSession.endSession(); 
        //redirect him into same page with an error message;
        return res.status(400).json({
            success:false,
            message:message,
        });
    };

};
exports.postSellerSignup = async (req,res,next)=>{
    // in future make an api call to validate the trueness of drug license number, gst registration number,fssai number
    //for now since the pattern of drug license number has already been validated and you will end up here if the validation is correct;
    const validationError = validationResult(req);
    if(validationError.array()[0]){
        return res.status(400).json({
            errorMessage:validationError.array()[0]?.msg,
            success:false,
        });
    }
    // getting all the uploaded file links
    const uploadedFiles = {};
    for (const key in req.files) {
      uploadedFiles[key] = req.files[key].map((file) => file.path);
    }
    // this will only be executed if no validation errors are found.
    const {sellerName,sellerEmailId,sellerMobileNo,sellerPassword,drugLicenseNumber,gstRegistrationNumber,fssaiLicenseNumber,storeName, address, shopPincode, shopState, shopCity, locationLatitude,locationLongitude,activeTime} = req.body;
    // will only end up here when required fields are not empty, in that case it will throw an error at the time of input validations only
    const hashedPassword = await bcrypt.hash(sellerPassword,12);
    let transactionSession=await mongoose.startSession();;
    transactionSession.startTransaction();
    try{
        //check whether the user already exists or not on the basis of drugLicense number, fssai number
        // here emailId and mobile number cannot be unique identifier as one customer can have two or more shop which he wants to register with the same emailId
        const isSellerAlreadyRegistered = await sellerDetails.findOne({$or:[{drugLicenseNumber:drugLicenseNumber},{fssaiLicenseNumber:fssaiLicenseNumber}]});
        if(isSellerAlreadyRegistered){
            throw new Error('User already registered with provided Drug License Number or FSSAI Number');
        }
        //rarest case - If same email Id which is registered on different role has same password
        // it is only achievable by a single user
        
        let isLoginObjPresent; 
        await loginDetails.findOne({emailId:sellerEmailId}).then(async res=>{
            if(res){
                isLoginObjPresent = await bcrypt.compare(sellerPassword,res.password);
            }else{
                isLoginObjPresent = false;
            }
            // await bcrypt.compare(sellerPassword,res.password)
        })
        if(isLoginObjPresent){
            throw new Error('This password exists for same emailId with different Role, please create different password');
        }
        // user is not registered, validate otps
        const client =await MongoClient.connect(devDBURI.DB_Connections.DEV_URI);
        const db = client.db('devDB');
        const sessions = db.collection('sessions');
        const doesSessionExists = await sessions.findOne({'session.emailId':sellerEmailId});
        if(doesSessionExists){
            if(!doesSessionExists.session.isEmailOtpVerified){
                throw new Error('OTP Verification pending');
            }
        }else{
            throw new Error('Please validate Email Address');
        }

        let loginObj,userObj;
        loginObj = await loginDetails.create([{emailId:sellerEmailId,mobileNumber:sellerMobileNo,password:hashedPassword,roleId:2}],{session:transactionSession});
        if(!loginObj){
            // console.log('Failed to create entry in login_details_db');
            throw new Error('Failed to create user');
        }
        const addressStructure={
            address:address,
            mobileNumber:Number(sellerMobileNo),
            state:shopState,
            city:shopCity,
            pincode:Number(shopPincode),
            location :{
                coordinates:[Number(locationLongitude),Number(locationLatitude)],
            }
        };
        const storeAddress = addressStructure;
        // storing operating day and working hours
        const operatingDays = String(activeTime).split(',');
        const dayData = []
        operatingDays.forEach(day=>{
            const fields = day.split('&');
            const obj = {
                workingDay  : fields[0],
                openingHour : fields[1],
                closingHour : fields[2],
            };
            dayData.push(obj);
        });
        const storeDetails ={
            storeName:storeName,
            ownerName:sellerName,
            emailId: new ObjectId(loginObj[0]._id),
            password: new ObjectId(loginObj[0]._id),
            contactNumber:new ObjectId(loginObj[0]._id),
            logoDetails:{
                logo:uploadedFiles.storeLogo[0],
                headerLogo:uploadedFiles.headerLogoForPdf[0],
                footerLogo:uploadedFiles.footerLogoForPdf[0],
            },
            workingDetail : dayData,
        }
        userObj = await sellerDetails.create([{drugLicenseNumber:drugLicenseNumber,gstRegistrationNumber:gstRegistrationNumber,fssaiLicenseNumber:fssaiLicenseNumber,storeAddress:storeAddress,storeDetails:storeDetails,'temporaryCart.items':[],'temporaryCart.totalPrice':0,resetToken:'',resetTokenExpiration:'',products:[]}],{session:transactionSession});
        if(!userObj){
            // console.log('Failed to create entry in medicationShopRegistrationDB');
            throw new Error('Failed to create user');
        }
        const isLoginDBupdated = await loginDetails.findOneAndUpdate({$and:[{emailId:sellerEmailId},{mobileNumber:sellerMobileNo},{roleId:2}]},{$set:{entityObject:new ObjectId(userObj._id),entityModel:DB_Constants.MEDICAL_STORE_DB}},{new:true,session:transactionSession});
        if(!isLoginDBupdated){
            // console.log('Failed to update Login DB');
            throw new Error('Failed to create user');
        }
        await sessions.deleteOne({'session.emailId':sellerEmailId});
        await transactionSession.commitTransaction();
        transactionSession.endSession();
        return res.status(200).json({
            success:true,
            message:'SignUp Successful !!',
            redirectUrl:'/',
        })
    }catch(err){
        //delete images if any error occours
        let message = "";
        if(err.message == 'User already registered with provided Drug License Number or FSSAI Number' || err.message == 'This password exists for same emailId with different Role, please create different password' || err.message == 'OTP Verification pending' || err.message == 'Please validate Email Address' || err.message == 'Failed to create user'){
            message = err.message;
        }else{
            console.log(err.message,err.stack);
            message  = 'Error occoured ! Try again';
        }
        try{
            const pIds = [req.files.storeLogo[0].filename,req.files.headerLogoForPdf[0].filename,req.files.footerLogoForPdf[0].filename];
            const result = await cloudinary.api.delete_resources(pIds);
        }catch(err){
            console.log(err,err.stack);
            message+= ('\n'+err.message);        
        }
        await transactionSession?.abortTransaction();
        transactionSession.endSession();
        return res.status(400).json({
            success:false,
            message:message,
        });
    }
}

