
const addressStructure = {
    mobileNumber:{type:Number},
    address:{type:String,required:true},
    state:{
        type:String,  
        required:true
    },
    city:{
        type:String,
        required:true
    },
    location: {
        type: { type: String, enum:["Point"] ,default: "Point"},
        coordinates: { type: [Number]} // Geospatial index
    },
    pincode:{type:Number, required:true}, // you need to connect to public api - India Post Pincode API
}
module.exports = addressStructure;