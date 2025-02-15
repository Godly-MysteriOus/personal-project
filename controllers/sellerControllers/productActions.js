const path = require('path');
const productDBPath = path.join('..','..','models','productDB');
const productDB = require(productDBPath);
const mongoose = require('mongoose');
const session = require('express-session');
function findProduct(productId,userId){
    return productDB.findOne({productId:productId,sellerId:userId}).then(result=>result);
}
function createProduct(productId,userId,quantity,price,transactionSession){
    return productDB.create({productId:productId,sellerId:userId,quantity:quantity,price:price,buyers:0,ratingCount:0,reviews:[]},{session:transactionSession}).then(result=>result.toObject());
}
// req.user contains the data of loggedIn user
exports.getListedProducts = async(req,res,next)=>{
    const userId = new ObjectId(req.user._id);
    const listedProducts = await productDB.findAll({sellerId:userId});
    return res.render('Seller/sellerHomePage',{
        products : listedProducts || [],
    });
};

exports.postDeleteProduct = async(req,res,next)=>{
    try{
        const productId = new ObjectId(req.params.productId);
        await productDB.deleteOne({productId:productId});
        return res.json({
            success: true,
            message: 'Successfully deleted product',
            redirectUrl : 'seller/listed-products',
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
    return res.render('Seller/addProductPage',{   

    });
};
exports.postAddProduct  =async (req,res,next)=>{
    const{productId,quantity,price} = req.body;
    const userId = new ObjectId(req.user._id);
    const recievedProductId = new Object(productId);
    try{
        const result = createProduct(recievedProductId,userId,Number(quantity),Number(price));
        return res.json({
            success:true,
            message: 'Product added succesfully!!',
            redirectUrl : 'seller/listed-products',
        });
    }catch(err){
        console.log('Failed to add product',err.stack);
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
    return res.render('Seller/editProduct',{
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
            redirectUrl : 'seller/listed-products',
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
    return res.render('Seller/bulkUploadPage');
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