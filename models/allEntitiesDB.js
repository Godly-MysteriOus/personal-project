const mongoose  = require('mongoose');
const DB_Constants = require('../DB_Names');
const Schema = mongoose.Schema;

const loginInfoDB = new Schema({
    emailId:{
        type:String,
        unique:true,
    },
    mobileNumber:{
        type:Number,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    roleId:{
        type:Number,
        required:true,
    },
    entityObject: {
        type: Schema.Types.ObjectId,
        // required: true,
        refPath: 'entityModel', // Dynamic reference to determine the collection
    },
    entityModel:{
        type: String,
        // required: true,
        enum:[DB_Constants.USER_REGISTRATION_STORE_DB,DB_Constants.MEDICAL_STORE_DB], //add admin thing here
    }
});
module.exports = mongoose.model(DB_Constants.LOGIN_INFO_DB,loginInfoDB,DB_Constants.LOGIN_INFO_DB);

