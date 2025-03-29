const credentialDB = require('../../models/allEntitiesDB');
const userDetailDB = require('../../models/userRegisterationDB');
const centralMedicineDB = require('../../models/centralMedicineDB');
const productDB = require('../../models/productDB');
const storeDetailDB = require('../../models/medicalShopRegistrationDB');
const{ObjectId}  =require('mongodb');
function isTimeInRange(startTime, endTime) {
    const now = new Date(); // Current time

    // Convert start and end times to today's date with specified hours/minutes
    const start = new Date(now);
    const [startHour, startMinute] = startTime.split(":").map(Number);
    start.setHours(startHour, startMinute, 0); // Set start time

    const end = new Date(now);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    end.setHours(endHour, endMinute, 0); // Set end time

    return now >= start && now <= end;
}
exports.getHomePage = async(req,res,next)=>{
    if(req.user){
        let userInfo = await credentialDB.find({_id:req.user.mobileNumber}).select('emailId mobileNumber -_id');
        userInfo = userInfo[0]; 
        return res.status(200).render('Customer/customerHomePage',{
            userDetails : userInfo,
            address:req.user?.activeAddress,
        });
    }else{
        res.status(200).render('Login/login',{
            path:'/login',
        });
    }
};

exports.searchListedProducts = async(req,res,next)=>{
    const {medicineId} = req.body;
    //find is this medicine genuine
    try{
        const isProductGenuine = await centralMedicineDB.findOne({productId:medicineId}).select('name manufacturer productImage medicineType packagingDetails productForm useOf ');
        if(!isProductGenuine){
            throw new Error('Invalid medicine name');
        };
        //getting all the stores within 50km range
        let allSellersWithinRange = await storeDetailDB.aggregate([
            {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [
                            Number(req.user.activeAddress.location.coordinates[0]),
                            Number(req.user.activeAddress.location.coordinates[1]),
                        ],
                    },
                    distanceField: "distance",
                    maxDistance: 500000,
                    spherical: true,
                    key: "storeAddress.location", // Ensure this field is indexed
                },
            },
        ]).sort({'distance':1});
        // filtering store on basis of their availability
        const allAvailableSellersWithinRange =  allSellersWithinRange.filter(seller=>seller.storeDetails.workingDetail.find(item=>{
            const date = new Date();
            const startTime = item.openingHour;
            const closingTime = item.closingHour;
            if(item.workingDay == date.toLocaleDateString('en-US', { weekday: 'long' }) && isTimeInRange(startTime,closingTime)){
                return item;
            }
        })).map(seller=>{
            return{
                _id : seller._id,
                storeLocation : seller.storeAddress.address,
                storeState : seller.storeAddress.state,
                storeCity : seller.storeAddress.city,
                storePincode : seller.storeAddress.pincode,
                storeName : seller.storeDetails.storeName,
                workingDetails : seller.storeDetails.workingDetail,
            }
        });
        if(allAvailableSellersWithinRange.length == 0){
            res.status(200).render('Customer/customerUtils/customerHomePageProductView.ejs',{medicineInfo : isProductGenuine,sellers: []});
        }
        // fetching list of sellers Ids within 50km
        const sellerIds = allSellersWithinRange.map(store=>store._id);
        // fetching list of sellers within 50km Id who has required medicine Listed
        const sellersWithListedMedicineInRange = await productDB.find({sellerId:{$in:sellerIds},productId:isProductGenuine._id});
        // returing a single coupled oject for each store
        const allAvailableSellerWithinRangeWithListedMedicine = allAvailableSellersWithinRange.filter(store=>sellersWithListedMedicineInRange.find(seller=>seller.sellerId.toString()==store._id.toString()));
        // console.log( allAvailableSellerWithinRangeWithListedMedicine);
        const desiredList = allAvailableSellerWithinRangeWithListedMedicine.map(store=>{
            const temp = sellersWithListedMedicineInRange.filter(seller=>seller.sellerId.toString()==store._id.toString());
            const modifiedProductObj = {
                productId : medicineId,
                qty : temp[0].quantity,
                price : temp[0].price,
                buyers: temp[0].buyers,
                ratingCount : temp[0].ratingCount,
            };
            const finalObj = {
                storeDetail : store,
                productInfo : modifiedProductObj,
            }
            return finalObj;
        });
        return res.status(200).render('Customer/customerUtils/customerHomePageProductView.ejs',{medicineInfo : isProductGenuine,sellers: desiredList});
    }catch(err){
        console.log(err,err.stack);
        return res.status(200).render('Customer/customerUtils/customerHomePageProductView.ejs',{medicineInfo : [],sellers: []});
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
            location:{
                coordinates:[Number(longitude),Number(latitude)],
            },
            pincode:pincode,
        };
        let isLocationSaved;
        if(req.user.userAddresses.length!=0)
            isLocationSaved = req.user.userAddresses?.filter(addr=>addr.location.coordinates[1]==userAddress.location.coordinates[1] && addr.location.coordinates[0] == userAddress.location.coordinates[0]);
        if(isLocationSaved){
            throw new Error('Address Already Saved');
        }
        const addressArr = [...req.user.userAddresses,userAddress];
        const saveAddress = await userDetailDB.findById(req.user._id);
        saveAddress.userAddresses = addressArr;
        saveAddress.activeAddress = userAddress;
        await saveAddress.save();
        return res.status(200).json({
            success:true,
            message:'Saved Successfully',
        });
    }catch(err){
        let message;
        if(err.message=='Address Already Saved'){
            message = err.message;
        }else{
            message = 'Failed to save address';
            console.log(err.stack,err.message);
        }
        return res.status(400).json({
            success:false,
            message:message,
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