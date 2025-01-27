const mongoose = require('mongoose');
const DB_Constants = require('../DB_Names');
const Schema = mongoose.Schema;
// what will it do ?
// will run a cron job which will read all the sales order of a medical store each day and creates a object which stores daily sales of all the medicine into a single object
const dailySales = new Schema({
    date:{type:Date,required:true,unique:true},
    medicines_sold:[{
        itemId:{
            type:Schema.Types.ObjectId,
            ref:DB_Constants.CENTRAL_MEDICINE_DB,
            required:true,
            unique:true,
        },
        quantity:{type:Number,required:true},
        price:{type:Number,required:true,}
    }],
    totalPrice:{type:Number,required:true},
    medicalStoreId:{
        type:Schema.Types.ObjectId,
        ref:DB_Constants.MEDICAL_STORE_DB,
        require:true,
    }
});
module.exports = mongoose.model(DB_Constants.DAILY_SALES_DB,dailySales,DB_Constants.DAILY_SALES_DB);