const mongoose = require('mongoose');
const DB_Constants = require('../DB_Names');
const Schema = mongoose.Schema;

const product = new Schema({
    productId:{
        type:Schema.Types.ObjectId,
        ref:DB_Constants.CENTRAL_MEDICINE_DB,
        required:true,
    },
    sellerId:{
        type:Schema.Types.ObjectId,
        ref:DB_Constants.MEDICAL_STORE_DB,
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    buyers:{
        type:Number,
        default:0,
    },
    ratingCount:{
        type:Number,
        required:true,
    },
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    reviews:[{
        customerId:{type:Schema.Types.ObjectId,ref:DB_Constants.USER_REGISTRATION_STORE_DB,required:true},
        date:{type:Date,required:true},
        comment:{type:String,required:true},
    }]
});

module.exports  =  mongoose.model(DB_Constants.PRODUCT_DB,product,DB_Constants.PRODUCT_DB);