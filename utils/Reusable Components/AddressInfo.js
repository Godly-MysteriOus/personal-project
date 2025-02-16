
const addressStructure = {
    line1:{type:String,required:true},
    line2:{type:String},
    state:{
        type:String,  
        required:true
    },
    city:{
        type:String,
        required:true
    },
    latitude:{type:Number,unique:false},
    longitude:{type:Number,unique:false},
    pincode:{type:Number, required:true}, // you need to connect to public api - India Post Pincode API
}
module.exports = addressStructure;