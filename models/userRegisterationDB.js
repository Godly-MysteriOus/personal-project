const mongoose = require('mongoose');
const medicineInfo = require('../utils/Reusable Components/MedicineInfo');
const addressStructure = require('../utils/Reusable Components/AddressInfo');
const DB_Constants = require('../DB_Names');
const Schema = mongoose.Schema;
const userDB = new Schema({
    customerName:{
        type:String,
        required:true,
    },
    emailId:{
        type:Schema.Types.ObjectId,
        ref:DB_Constants.LOGIN_INFO_DB,
        required:true,
    },
    mobileNumber:{
        type:Schema.Types.ObjectId,
        ref:DB_Constants.LOGIN_INFO_DB,
        required:true,
    },
    password:{
        type:Schema.Types.ObjectId,
        ref:DB_Constants.LOGIN_INFO_DB,
        required:true,
        // password must be hash value
    },
    userAddresses:[{type:addressStructure}],
    activeAddress:{type:addressStructure},
    cart:{
        items:[medicineInfo],
        totalPrice:{type:Number},
        // recieveViaMode:{
        //     type:Number,
        //     required:true,
        // }
    },
    resetToken:{type:String},
    resetTokenExpiration:{type:Date},
});
userDB.index({ "activeAddress.location": "2dsphere" });
module.exports = mongoose.model(DB_Constants.USER_REGISTRATION_STORE_DB,userDB,DB_Constants.USER_REGISTRATION_STORE_DB);