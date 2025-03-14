const credentialDB = require('../../models/allEntitiesDB');
const userDetailDB = require('../../models/userRegisterationDB');
const centralMedicineDB = require('../../models/centralMedicineDB');
const productDB = require('../../models/productDB');
const{ObjectId}  =require('mongodb');
const { isPrimary } = require('../../utils/Reusable Components/AddressInfo');
exports.getHomePage = async(req,res,next)=>{
    let userInfo = await credentialDB.find({_id:req.user.mobileNumber}).select('emailId mobileNumber -_id');
    userInfo = userInfo[0]; 
    return res.status(200).render('Customer/customerHomePage',{
        userDetails : userInfo,
    });
};

exports.searchListedProducts = async(req,res,next)=>{
    const {medicineId} = req.body;
    //find is this medicine genuine
    try{
        const isProductGenuine = await centralMedicineDB.findOne({productId:medicineId}).select('name manufacturer productImage medicineType packagingDetails productForm useOf ');
        if(!isProductGenuine){
            throw new Error('Invalid medicine name');
        }
        const allSellerWhoListedProduct = await productDB.find({productId:isProductGenuine._id}).populate('sellerId','storeDetails.storeName -_id').limit(5);
        // return res.status(200).json({
        //     success:true,
        //     medicineInfo : isProductGenuine,
        //     sellers: allSellerWhoListedProduct,
        // });
        return res.status(200).render('Customer/customerUtils/customerHomePageProductView.ejs',{medicineInfo : isProductGenuine,sellers: allSellerWhoListedProduct});
    }catch(err){
        return res.status(400).json({
            success:false,
            message:err.message,
        })
    }
}
exports.userLocations = async(req,res,next)=>{
    const {userId} = req.body;
    let userDetails = await userDetailDB.findById(new ObjectId(userId)).select('name emailId mobileNumber userAddresses -_id');
    const addresses = userDetails.userAddresses;
    return res.status(200).json({
        success:true,
        message:'Fetched Location successfully',
        data:addresses,
    });
} 

exports.getProfilePage = async(req,res,next)=>{
    let userDetails = await userDetailDB.findById(req.user._id).select('customerName emailId -_id').populate('emailId','emailId mobileNumber -_id');
    const userInfo ={
        name:userDetails.customerName,
        emailId:userDetails.emailId.emailId,
        mobileNumber : userDetails.emailId.mobileNumber,
    }
    return res.status(200).render('Customer/customerProfilePage.ejs',{
        userInfo : userInfo,
    });
}
exports.getCartPage = (req,res,next)=>{
    return res.status(200).render('Customer/customerCartPage.ejs');
}

exports.getUserAddresses = async(req,res,next)=>{
    try{
        let userAddresses = await userDetailDB.findById(req.user._id).select('userAddresses -_id');
        userAddresses = userAddresses.userAddresses;
        return res.status(200).json({
            success:true,
            message:'fetched addresses successfully',
            data:userAddresses,
        });
    }catch(err){
        console.log(err.stack);
        return res.status(400).json({
            success:false,
            message:'Failed to fetch user addresses',
        });
    }

}
exports.saveUserAddress = async(req,res,next)=>{
    const {mobileNo,latitude,longitude,pincode,state,city,address} = req.body;
    try{
        const userAddress = {
            line1 : address,
            mobileNumber:mobileNo,
            isPrimary:1,
            state:state,
            city:city,
            latitude:latitude,
            longitude:longitude,
            pincode:pincode,
        };
        const addressArr = [...req.user.userAddresses,userAddress];
        const saveAddress = await userDetailDB.findById(req.user._id);
        saveAddress.userAddresses = addressArr;
        saveAddress.save();
        return res.status(200).json({
            success:true,
            message:'Saved Successfully',
        });
    }catch(err){
        return res.status(400).json({
            success:false,
            message:'Failed to save user',
        });
    }
}