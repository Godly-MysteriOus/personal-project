const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DB_CONSTANT = require('../../DB_Names');
const addressStructure = {
    line1:{type:String,required:true},
    line2:{type:String},
    line3:{type:String},
    state:{
        type:String,  
        required:true
    },
    city:{
        type:String,
        required:true
    },
    latitude:{type:Number},
    longitude:{type:Number},
    pincode:{type:Number, required:true}, // you need to connect to public api - India Post Pincode API
}
module.exports = addressStructure;