const credentialDB = require('../../models/allEntitiesDB');
const userDetailDB = require('../../models/userRegisterationDB');
const centralMedicineDB = require('../../models/centralMedicineDB');
const productDB = require('../../models/productDB');
const storeDetailDB = require('../../models/medicalShopRegistrationDB');
const{ObjectId}  =require('mongodb');
let saveSession=(session)=> {
    return new Promise((resolve, reject) => {
        session.save(err => {
            if (err) {
                reject(new Error('Failed to save session'));
            } else {
                resolve(true);
            }
        });
    });
}
function isTimeInRange(startTime, endTime) {
    // Get current time in IST
    const nowUTC = new Date();
    let nowIST;
    if(nowUTC.toString().includes('India Standard Time')){
        nowIST = nowUTC;
    }else{
        nowIST = new Date(nowUTC.getTime() + (5.5 * 60 * 60 * 1000)); // Convert to IST
    }
    // Convert start and end times to IST date with specified hours/minutes
    const start = new Date(nowIST);
    const [startHour, startMinute] = startTime.split(":").map(Number);
    start.setHours(startHour, startMinute, 0, 0); // Set start time in IST
    const end = new Date(nowIST);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    end.setHours(endHour, endMinute, 0, 0); // Set end time in IST

    return nowIST >= start && nowIST <= end;
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
                    maxDistance: 50000,
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
                distance : seller.distance,
            }
        });
        if(allAvailableSellersWithinRange.length == 0){
            res.status(200).render('Customer/customerUtils/customerHomePageProductView.ejs',{medicineInfo : isProductGenuine,sellers: []});
        }else{
            // fetching list of sellers Ids within 50km
            const sellerIds = allSellersWithinRange.map(store=>store._id);
            // fetching list of sellers within 50km Id who has required medicine Listed  
            const allAvailableSellersWithListedMedicineInRange = await productDB.find({sellerId:{$in:sellerIds},productId:isProductGenuine._id,quantity:{$gt:1}}).populate('sellerId','storeDetails.storeName');
            // returing a single coupled oject for each store
            // const allAvailableSellerWithinRangeWithListedMedicine = allAvailableSellersWithinRange.filter(store=>sellersWithListedMedicineInRange.find(seller=>seller.sellerId.toString()==store._id.toString()));
            const desiredList =  allAvailableSellersWithListedMedicineInRange.map(store=>{
                const modifiedProductObj = {
                    sellerId : store.sellerId._id,
                    productId : medicineId,
                    qty : store.quantity,
                    price : store.price,
                    buyers: store.buyers,
                    ratingCount : store.ratingCount,
                    storeName : store.sellerId.storeDetails.storeName,
                };
                const finalObj = {
                    storeDetail : modifiedProductObj,
                    productInfo : isProductGenuine,
                }
                return  finalObj;
            });
            return res.status(200).render('Customer/customerUtils/customerHomePageProductView.ejs',{medicineInfo : isProductGenuine,sellers: desiredList});
        }
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
exports.getCartPage = async(req,res,next)=>{
    return res.status(200).render('Customer/customerCartPage.ejs');
}


exports.getCartProduct = async(req,res,next)=>{
    try{
        const cart = await userDetailDB.findById(req.user._id).select('cart');
        const cartItems = cart.cart.items;
        const cartProductDetails = [];
        for (let item of cartItems) {
            const productObj = await centralMedicineDB.findById(item.productId).select('name manufacturer packagingDetails package productImage prescriptionRequired -_id');
            const sellerObj = await storeDetailDB.findById(item.sellerId).select('storeDetails.storeName storeAddress.address storeAddress.state storeAddress.city -_id');
            const newItem  = {
                productDetail : productObj,
                sellerDetail: sellerObj,
                qty : item.qty,
                price: item.price,
                sellerId : item.sellerId,
                productId : item.productId,
            }
            cartProductDetails.push(newItem);
        }
        const totalPrice = cart.cart.totalPrice;
        return res.status(200).render('Customer/customerUtils/customerCartProducts',{
            items: cartProductDetails || [],
            totalPrice : totalPrice || 0,
            deliveryFee : 30,
            freeDelivery : 30,
            platformFee : 10,
        })

    }catch(err){
        console.log(err.stack);
        return res.status(400).json({
            message : 'Error occoured while loading cart page',
            success:false
        })
    }
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

exports.postAddToCart = async(req,res,next)=>{
    let {productId,sellerId} = req.body; 
    sellerId = new ObjectId(sellerId);
    try{
        const isMedicineValid = await centralMedicineDB.findOne({productId:productId}).select('productId');
        if(!isMedicineValid){
            throw new Error('Invalid Medicine Name, cannot Add to Cart');
        }
        const validation = await productDB.findOne({productId: isMedicineValid._id, sellerId:sellerId,quantity:{$gt:1}});
        if(!validation){
            throw new Error('Product Out of stock, cannot add!');
        }
        const user = await userDetailDB.findOne({_id: req.user._id});
        let currentCart = user.cart.items;
        const isObjPresent = currentCart.filter(item=>item.productId.toString() == isMedicineValid._id.toString() && item.sellerId.toString() == sellerId.toString());
        if(isObjPresent.length==0){
            const obj = {
                productId : isMedicineValid._id,
                sellerId : sellerId,
                qty : 1,
                price : 1*validation.price,
            }
            currentCart.push(obj);
        }else{
            const idx = currentCart.findIndex(item=>item.productId.toString() == isMedicineValid._id.toString() && item.sellerId.toString() == sellerId.toString());
            const newQty = currentCart[idx].qty+1;
            currentCart[idx].qty = newQty;
            currentCart[idx].price = newQty*validation.price;
        }
        user.cart.items = currentCart;
        let price = 0;
        currentCart.forEach(item=>{
            price+=item.price;
        });
        user.cart.totalPrice = price;
        req.session.user = user;

        saveSession(req.session);
        await user.save();
        return res.status(201).json({
            success:true,
            message: 'Added to cart !',
        });
    }catch(err){
        console.log(err.stack);
        return res.status(400).json({
            success:true,
            message: 'Addition to cart failed!',
        });
    }
}

exports.increaseProductQuantity = async(req,res,next)=>{
    try{
        const {productId,sellerId} = req.body;
        const user = await userDetailDB.findById(req.user._id);
        const product = await productDB.findOne({productId: new ObjectId(productId),sellerId: new ObjectId(sellerId)});
        const cart = user.cart.items;
        let totalPrice = 0;
        cart.forEach(item=>{
            if(item.productId.toString()==productId && item.sellerId.toString()==sellerId){
                const currentQty = item.qty;
                item.qty=currentQty+1;
                item.price = (currentQty+1)*product.price;
            }
        });
        user.cart.items.forEach(item=>{
            totalPrice+=item.price;
        });
        user.cart.items = cart;
        user.cart.totalPrice = totalPrice;
        user.save();
        return res.status(200).json({
            message: 'Updated Cart Successfully',
            success:true,
        });
    }catch(err){
        return res.status(400).json({
            message: 'Error Updating Cart',
            success:false,
        });
    }
};
exports.reduceProductQuantity = async(req,res,next)=>{
    try{
        const {productId,sellerId} = req.body;
        const user = await userDetailDB.findById(req.user._id);
        const productDetail = await productDB.findOne({productId:new ObjectId(productId),sellerId:new ObjectId(sellerId)});
        const currentCart = user.cart.items;
        let requiredItemIndex = -1;
        if(currentCart.length>=1){
            requiredItemIndex = currentCart.findIndex(item=> (item.productId.toString()==productId && item.sellerId.toString()==sellerId));
        }
        currentCart[requiredItemIndex].qty-=1;
        currentCart[requiredItemIndex].price = currentCart[requiredItemIndex].qty*productDetail.price;
        let newCart = currentCart.filter(items=>items.qty>0);
        let totalPrice = 0;
        newCart.forEach(item=>{
            totalPrice+=item.price;
        });
        user.cart.items = newCart;
        user.cart.totalPrice = totalPrice;
        user.save();
        return res.status(200).json({
            message: 'Updated Cart Successfully',
            success:true,
        });
    }catch(err){
        console.log(err);
        res.status(400).json({
            message: 'Error Updating Cart',
            success:false,
        })
    }
}
exports.deleteProduct = async(req,res,next)=>{
    try{
        const {productId,sellerId} = req.body;
        const user = await userDetailDB.findById(req.user._id);
        const currentCart = user.cart.items;
        const newCart = currentCart.filter(item=>{
            if( !(item.productId.toString()==productId && item.sellerId.toString()==sellerId) ){
                return item;
            }
        });
        let totalPrice = 0;
        newCart.forEach(item=>{
            totalPrice+= (item.qty)*(item.price);
        });
        user.cart.items = newCart;
        user.cart.totalPrice = totalPrice;
        user.save();
        return res.status(200).json({
            message: 'Updated Cart Successfully',
            success:true,
        });
    }catch(err){
        console.log(err);
        return res.status(400).json({
            message: 'Error Updating Cart',
            success:false,
        });
    }
}