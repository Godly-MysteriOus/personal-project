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
        console.log(isProductGenuine,allSellerWhoListedProduct,allSellerWhoListedProduct[0].sellerId.storeDetails);
        return res.status(200).render('Customer/customerUtils/customerHomePageProductView.ejs',{medicineInfo : isProductGenuine,sellers: allSellerWhoListedProduct});
    }catch(err){
        console.log();
        return res.status(400).json({
            success:false,
            message:err.message,
        })
    }
}
exports.userLocations = async(req,res,next)=>{
    const {userId} = req.body;
    let addresses = await userDetailDB.findById(new ObjectId(userId)).select('userAddresses -_id');
    addresses = addresses.userAddresses;
    console.log('I am here ',addresses);
    return res.status(200).json({
        success:true,
        message:'Fetched Location successfully',
        data:addresses,
    });
} 

exports.getProfilePage = (req,res,next)=>{
    return res.status(200).render('Customer/customerProfilePage.ejs');
}
exports.getCartPage = (req,res,next)=>{
    return res.status(200).render('Customer/customerCartPage.ejs');
}