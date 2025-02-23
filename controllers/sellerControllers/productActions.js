const path = require('path');
const productDBPath = path.join('..','..','models','productDB');
const productDB = require(productDBPath);
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const centralMedicineDB = require('../../models/centralMedicineDB');
function findProduct(productId,userId){
    return productDB.findOne({productId:productId,sellerId:userId}).then(result=>result);
}
function createProduct(productId,userId,quantity,price,transactionSession){
    return productDB.create([{productId:productId,sellerId:userId,quantity:quantity,price:price,buyers:0,ratingCount:0,reviews:[]}],{session:transactionSession}).then(result=>result);
}
// req.user contains the data of loggedIn user

// exports.searchProductSeller = async(req,res,next)=>{
//     //sanitize medicine Id
//     const errors = validationResult(req);
//     if(errors.array().length!=0){
//         return res.status(400).json({
//             success:false,
//             message:errors.array()[0].msg,
//         })
//     }
//     const {medicineId} = req.body;
//     try{
//         const listedMedicine = productDB.find({sellerId: req.session.user._id,productId: new mongoose.Types.ObjectId(medicineId)});
//         return res.status({
//             succcess:true,
//             products:listedMedicine,
//             message:'Fetched listed product successfully',
//         });
//     }catch(err){
//         console.log('Encountered problem while fetching listed products',err.stack);
//         return res.status(400).json({
//             success:false,
//             message:err.message,
//         })
//     }
// }

exports.getListedProducts = async(req,res,next)=>{
    const storeName = req.user?.storeDetails.storeName;
    const ownerName =  req.user?.storeDetails.ownerName;
    const storeLogo =  req.user?.storeDetails.logoDetails.logo;
    const userDetail = {
        storeName:storeName,
        ownerName:ownerName,
        storeLogo:storeLogo,
    };
    const userId = new mongoose.Types.ObjectId(req.user?._id);
    const listedProducts = await productDB.find({sellerId:userId}).populate('productId','productId name useOf productForm manufacturer');
    // console.log(listedProducts);
    return res.render(path.join('Seller','sellerHomePage'),{
        products : listedProducts || [],
        userDetails : userDetail,
        path:"Seller/sellerHomePage",
    });
};

exports.postDeleteProduct = async(req,res,next)=>{
    try{
        const productId = new ObjectId(req.params.productId);
        await productDB.deleteOne({productId:productId});
        return res.json({
            success: true,
            message: 'Successfully deleted product',
            redirectUrl : path.join('seller','listed-products'),
        });
    }catch(err){
        console.log('Error while deleting product',err.stack);
        return res.json({
            success:false,
            messaage:err.messaage,
        });
    }
}
exports.getAddProduct = (req,res,next)=>{
    const storeName = req.user?.storeDetails.storeName;
    const ownerName =  req.user?.storeDetails.ownerName;
    const storeLogo =  req.user?.storeDetails.logoDetails.logo;
    const userDetail = {
        storeName:storeName,
        ownerName:ownerName,
        storeLogo:storeLogo,
    };
    return res.render(path.join('Seller','addProductPage'),{   
        userDetails:userDetail,
        path:'Seller/addProductPage',
    });
};
//working fine
exports.postAddProduct  =async (req,res,next)=>{
    const{productId,quantity,price} = req.body;
    // throw if any validation error
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({
            success:false,
            message:error.array()[0].msg,
        });
    }
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const recievedProductId = productId;
    const transactionSession = await  mongoose.startSession();
    //seller Id
    try{
        transactionSession.startTransaction();
        //find whether product exists or not
        const doesProductExists = await centralMedicineDB.findOne({productId:recievedProductId}).select('name');
        if(!doesProductExists){
            throw new Error('Unable to get details for entered product name');
        }
        // find whether the product is already listed or not, if not add else throw an error to update product
        const isProductAlreadyListed = await productDB.findOne({productId:doesProductExists._id,sellerId:userId});
        if(isProductAlreadyListed){
            throw new Error('Medicine Already Listed, Cannot list again !');
        }
        const result = await createProduct(doesProductExists._id,userId,Number(quantity),Number(price),transactionSession);
        if(!result){
            throw new Error('Error while adding product');
        }
        await transactionSession.commitTransaction();
        await transactionSession.endSession();
        return res.json({
            success:true,
            message: 'Product added succesfully!!',
            redirectUrl : path.join('seller','listed-products'),
        });
    }catch(err){
        await transactionSession.abortTransaction();
        await transactionSession.endSession();
        // console.log('Failed to add product',err.stack);
        return res.json({
            success:false,
            message:err.message,
        });
    }
};

exports.getEditProduct = async(req,res,next)=>{
    const productId = new ObjectId(req.params.productId);
    const userId = new ObjectId(req.user._id);
    const product = findProduct(productId,userId);
    return res.render(path.join('Seller','editProduct'),{
        product:product || [],
    });
}

exports.postEditProduct = async(req,res,next)=>{
    let {productId,price,quantity} = req.body;
    productId = new ObjectId(productId);
    price = Number(price);
    quantity = Number(quantity);
    const userId = new ObjectId(req.user._id);
    try{
        const result = await productDB.updateOne({productId:productId,sellerId:userId},{$set:{price:price,quantity:quantity}});
        return res.json({
            success:true,
            message: 'Successfully editted product details',
            redirectUrl : path.join('seller','listed-products'),
        });
    }catch(err){
        console.log('Error editting product details',err.stack);
        return res.json({
            success:false,
            message: err.message,
        });
    }
}

exports.getBulkUpload = (req,res,next)=>{
    return res.render(path.join('Seller','bulkUploadPage'),{});
};
exports.postBulkAddProduct = async(req,res,next)=>{
    const productList = req.body;
    const userId = new ObjectId(erq.user._id);
    const transactionSession = await mongoose.startSession(); 
    try{
        transactionSession.startTransaction();
        //for each item create an entry
        productList.forEach(async item => {
            // check if product already exits or not
            const productId = new ObjectId(item.productId);
            const quantity = Number(item.quantity);
            const price = Number(item.price);
            const isProductAvailable = findProduct(productId,userId);
            if(isProductAvailable){
                //update product
                isProductAvailable.quantity = quantity;
                isProductAvailable.price = price;
                await isProductAvailable.save();
            }else{
                //create product
                const isProductCreated = createProduct(productId,userId,quantity,price,transactionSession);
            }
        });
        await transactionSession.commitTransaction();
        await transactionSession.endSession();
    }catch(err){
        await transactionSession.abortTransaction();
        transactionSession.endSession();
        console.log('Error while bulk uploading',err.stack);
        return res.json({
            success:false,
            message:err.messsage,
        });
    }
}

exports.loadProductDetails = async(req,res,next)=>{
    const {medicineId} = req.body;
    try{
        const findProduct = await centralMedicineDB.findOne({productId:medicineId}).select('productImage name manufacturer packagingDetails productForm MRP useOf').lean();
        return res.status(200).json({
            success:true,
            message:'Successfully fetched data',
            data:findProduct,
        })
    }catch(err){
        console.log('Error while fetching product details',err.stack);
        return res.status(400).json({
            success:false,
            message: 'Error fetching data',
        });
    }

}