const credentialDB = require('../../models/allEntitiesDB');
const userDetailDB = require('../../models/userRegisterationDB');
const centralMedicineDB = require('../../models/centralMedicineDB');
const productDB = require('../../models/productDB');
const{ObjectId}  =require('mongodb');
exports.getHomePage = (req,res,next)=>{
    const userId = req.user._id;
    return res.status(200).render('Customer/customerHomePage',{
        userId : userId,

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
    console.log(userDetails);
    const addresses = userDetails.userAddresses;
    console.log(addresses);
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