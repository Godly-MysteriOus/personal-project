const mongoose = require('mongoose');
const DB_Constants = require('../DB_Names');
const Schema = mongoose.Schema;

const userQuery = new Schema({
    emailId:{type:String,required:true},
    mobileNo:{type:String,required:true},
    userMessage:{type:String,required:true},
    status:{type:String,default:'open'},
});

module.exports = mongoose.model(DB_Constants.USER_QUERIES_DB,userQuery,DB_Constants.USER_QUERIES_DB);