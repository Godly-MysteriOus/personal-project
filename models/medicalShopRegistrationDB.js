const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DB_CONSTANT = require('../DB_Names');
const medicineInfo = require('../utils/Reusable Components/MedicineInfo');
const addressStructure = require('../utils/Reusable Components/AddressInfo');


const medicalShopDB = new Schema({
    drugLicenseNumber:{type:String,required:true,unique:true},

    gstRegistrationNumber:{type:String,required:true},

    fssaiLicenseNumber:{type:String,required:true,unique:true},

    storeAddress:addressStructure,
    storeDetails:{
        storeName:{type:String,required:true},
        ownerName:{type:String,required:true},
        emailId:{type:Schema.Types.ObjectId,ref:DB_CONSTANT.LOGIN_INFO_DB,required:true},
        password:{type:Schema.Types.ObjectId,ref:DB_CONSTANT.LOGIN_INFO_DB,required:true},
        contactNumber:{type:Schema.Types.ObjectId,ref:DB_CONSTANT.LOGIN_INFO_DB,required:true},
        //check for logo files
        logoDetails:{
            logo:{type:String},
            headerLogo:{type:String},
            footerLogo:{type:String},
        },
        openingHours :{type:String,required:true},
        closingHours:{type:String,required:true},
        openOnDays:{type:String,required:true}
    },
    temporaryCart:{
        items:[medicineInfo],
        totalPrice:{type:Number,required:true},
    },
    resetToken:{type:String},
    resetTokenExpiration:{type:Date},
    roleAssigned:{
        type:Number,
        default:2,
    }
});
module.exports = mongoose.model(DB_CONSTANT.MEDICAL_STORE_DB,medicalShopDB,DB_CONSTANT.MEDICAL_STORE_DB);


//last thing you need to figure it out is the coordinate system