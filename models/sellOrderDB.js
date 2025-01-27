const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const medicineInfo = require('../utils/Reusable Components/MedicineInfo');
const DB_Constants = require('../DB_Names');
const sellOrderInfo = new Schema({
    medicines:[medicineInfo],
    date:{type:Date,required:true},
    totalPrice:{type:Number,required:true},
    soldTo:{
        customer:{
            type:Schema.Types.ObjectId,
            ref:DB_Constants.USER_REGISTRATION_STORE_DB,
            required:true,
        }
    },
    medicalStoreId:{
        type:Schema.Types.ObjectId,
        ref:DB_Constants.MEDICAL_STORE_DB,
        require:true,
    },
    soldViaMode:{
        type:Schema.Types.ObjectId,
        ref:DB_Constants.RECIEVE_TYPE_DB,
        required:true,
    },
    paymentStatus:{
        type:Boolean,
        required:true,
    }
});

module.exports = mongoose.model(DB_Constants.SELL_ORDERS_DB,sellOrderInfo,DB_Constants.SELL_ORDERS_DB);