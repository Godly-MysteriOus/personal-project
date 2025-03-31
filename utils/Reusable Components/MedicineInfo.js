const DB_CONSTANT = require('../../DB_Names');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const medicineInfo = {
    productId: {
        type:Schema.Types.ObjectId,
        ref:DB_CONSTANT.CENTRAL_MEDICINE_DB,
        required:true,
    },
    sellerId :{
        type:Schema.Types.ObjectId,
        ref: DB_CONSTANT.MEDICAL_STORE_DB,
        required:true,
    },
    qty:{type:Number, required:true}, 
    price:{type:Number,required:true},             
};

module.exports = medicineInfo;