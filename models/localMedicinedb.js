const mongoose = require('mongoose');
const DB_Constants = require('../DB_Names');
const Schema = mongoose.Schema;

const localMedicineDB = new Schema({
    medicalStoreId:{
        type:Schema.Types.ObjectId,
        ref:DB_Constants.MEDICAL_STORE_DB,
        required:true
    },
    availableMedicinesInStore:{
        medicine:[{
            medicineId:{
                type:Schema.Types.ObjectId,
                ref:DB_Constants.CENTRAL_MEDICINE_DB,
                required:true
            },
            quantityStoreHolds:{type:Number,required:true}
        }]
    }
});
module.exports = mongoose.model(DB_Constants.LOCAL_MEDICINE_DB,localMedicineDB,DB_Constants.LOCAL_MEDICINE_DB);