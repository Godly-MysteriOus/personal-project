const mongoose = require('mongoose');
const DB_Constants = require('../DB_Names');
const Schema = mongoose.Schema;

const product = new Schema({
    
});

mongoose.model(DB_Constants.PRODUCT_DB,product,DB_Constants.PRODUCT_DB);