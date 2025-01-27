const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const medicineInfo = require('../utils/Reusable Components/MedicineInfo');
const DB_Constants = require('../DB_Names');

const buyOrderInfo = new Schema({
    medicines:[medicineInfo],
    date:{type:Date,required:true},
    totalPrice:{type:Number,required:true},
    boughtFrom:{
        wholeseller:{
            sellerName:{type:String,required:true},
            sellerEmailId:{type:String},
        }
    },
    medicalStoreId:{
        type:Schema.Types.ObjectId,
        ref:DB_Constants.MEDICAL_STORE_DB,
        require:true,
    },
    status:{
        type:String,
        required:true,
    }
});

module.exports = mongoose.model(DB_Constants.BUY_ORDERS_DB,buyOrderInfo,DB_Constants.BUY_ORDERS_DB);