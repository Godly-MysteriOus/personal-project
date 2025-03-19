const credentialDB = require('../../models/allEntitiesDB');
const userDetailDB = require('../../models/userRegisterationDB');
const centralMedicineDB = require('../../models/centralMedicineDB');
const productDB = require('../../models/productDB');
const{ObjectId}  =require('mongodb');
exports.getHomePage = async(req,res,next)=>{
    let userInfo = await credentialDB.find({_id:req.user.mobileNumber}).select('emailId mobileNumber -_id');
    userInfo = userInfo[0]; 
    return res.status(200).render('Customer/customerHomePage',{
        userDetails : userInfo,
        address:req.user.activeAddress,
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
        userAddresses = userAddresses?.userAddresses||[];
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
            address : address,
            mobileNumber:mobileNo,
            state:state,
            city:city,
            latitude:latitude,
            longitude:longitude,
            pincode:pincode,
        };
        const addressArr = [...req.user.userAddresses,userAddress];
        const saveAddress = await userDetailDB.findById(req.user._id);
        saveAddress.userAddresses = addressArr;
        saveAddress.activeAddress = userAddress;
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
exports.getAllAddress = async(req,res,next)=>{
    let allAddress = req.user.userAddresses;
    const activeAddress = req.user.activeAddress;
    
    allAddress = allAddress.filter(addr=> addr.address!=activeAddress.address);
    return res.status(200).json({
        success:'true',
        currentAddress : activeAddress,
        allSavedAddress: allAddress,
    })
};
exports.postUpdateActiveAddress = async(req,res,next)=>{
    const {address} = req.body;
    const activeAddress = req.user.userAddresses.filter(addr=>addr.address==address);
    try{
        const updateAddress = await userDetailDB.findById(req.user._id);
        updateAddress.activeAddress = activeAddress[0];
        await updateAddress.save();
        return res.status(200).json({
            success:true,
            message:'Successfully updated active address',
            activeAddress : activeAddress[0],
        })
    }catch(err){
        console.log(err.message,err.stack);
        return res.status(400).json({
            success:false,
            message:'Error occoured while updating active address',
        })
    }
}