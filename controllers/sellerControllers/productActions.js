const path = require('path');
const productDBPath = path.join('..','..','models','productDB');
const productDB = require(productDBPath);
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const centralMedicineDB = require('../../models/centralMedicineDB');
const PAGINATION_COUNT = 10;
function findProduct(productId,userId){
    return productDB.findOne({productId:productId,sellerId:userId}).then(result=>result);
}
function createProduct(productId,userId,quantity,price,transactionSession){
    return productDB.create([{productId:productId,sellerId:userId,quantity:quantity,price:price,buyers:0,ratingCount:0,reviews:[]}],{session:transactionSession}).then(result=>result);
}
exports.getListedProducts = async(req,res,next)=>{
    const userId = req.user._id;
    try{
        const listedProducts = await productDB.find({sellerId:userId}).select('productId -_id').populate('productId','productId name-_id');
        const requiredData = listedProducts.map(item=>{
            return{
                name: item.productId.name,
                productId:item.productId.productId,
            }
        });
        return res.status(200).json({
            success:true,
            data : requiredData,
            message: 'Fetched Data successfully',
        });
    }catch(err){
        console.log('Error occured while getting name of listed product',err.stack);
        return res.status(400).json({
            success:false,
            message:'Error while updating searchBar !',
        });
    }
}
exports.listedProductsPaginatedData = async(req,res,next)=>{
    const currentPage = Number(req.body.pageNo) || 1;
    const userId = req.user._id;
    try{
        const listedProductsCount = await productDB.countDocuments({sellerId:userId});
        const maxPageCount = Math.ceil(Number(listedProductsCount)/PAGINATION_COUNT);
        if(currentPage<1 || currentPage>maxPageCount){
           throw new Error('Invalid page request');
        }
        const listedProduct = await productDB.find({sellerId:userId}).select('productId quantity price -_id').populate('productId','productId name useOf productForm manufacturer -_id').skip((currentPage-1)*PAGINATION_COUNT).limit(PAGINATION_COUNT);
        return res.render('sellerUtils/dataGridReload',{products:listedProduct,currentPageNo:Math.min(currentPage,maxPageCount),lastPageNo:maxPageCount});
    }catch(err){
        console.log('Error loading pagination',err.stack);
        return res.status(400).json({
            success:false,
            message:err.message,
        });
    }
}
exports.getListedProductsPage = async(req,res,next)=>{
    const storeName = req.user?.storeDetails.storeName;
    const ownerName =  req.user?.storeDetails.ownerName;
    const storeLogo =  req.user?.storeDetails.logoDetails.logo;
    const userDetail = {
        storeName:storeName,
        ownerName:ownerName,
        storeLogo:storeLogo,
    };
    const userId = new mongoose.Types.ObjectId(req.user?._id);
    const listedProductsCount = await productDB.countDocuments({sellerId:userId});
    const maxPageCount = Math.ceil(Number(listedProductsCount)/PAGINATION_COUNT);
    const listedProducts = await productDB.find({sellerId:userId}).select('productId quantity price -_id').populate('productId','productId name useOf productForm manufacturer -_id').limit(PAGINATION_COUNT);
    return res.render(path.join('Seller','sellerHomePage'),{
        products : listedProducts || [],
        userDetails : userDetail,
        path:"Seller/sellerHomePage",
        currentPageNo:1,
        lastPageNo:maxPageCount,
    });
};

exports.postDeleteProduct = async(req,res,next)=>{
    let {productIdList,currentPage} = req.body;
    currentPage = Number(currentPage);
    const userId = req.user._id;
    const transactionSession = await mongoose.startSession();
    transactionSession.startTransaction();
    try{
        const productIds = productIdList.split(',');
        // find medicine Id against product Id first
        let medicineIds = [];
        for(let product of productIds){
            const medicineId = await centralMedicineDB.findOne({productId:product});
            if(!medicineId){
                throw new Error('Invalid medicine selected to delete');
            }
            //medicineId._id contains Id of medicine in central db
            medicineIds.push(medicineId._id);
        }
        //find whether the seller has listed this product or not
        for(let medicineId of medicineIds){
            const isListed = await productDB.findOne({productId:medicineId,sellerId: userId});
            if(!isListed){
                throw new Error('Only listed products can be deleted');
            }
        }
        // seller has select products to delete which is listed by him - start deleting products
        const isProductDeleted = await productDB.deleteMany({productId:{$in:medicineIds}});
        if(isProductDeleted.acknowledged == false || isProductDeleted.deletedCount == 0){
            throw new Error('Failed to delete products');
        }
        // fetch new list of product
        const listedProducts = await productDB.find({sellerId:userId}).select('productId quantity price -_id').populate('productId','productId name useOf productForm manufacturer -_id').skip((Number(currentPage.value)-1)*PAGINATION_COUNT).limit(PAGINATION_COUNT);
        const countDocuments = await productDB.countDocuments({sellerId:userId});
        await transactionSession.commitTransaction();
        await transactionSession.endSession();
        const maxPageCount = Math.ceil(countDocuments/PAGINATION_COUNT);
        return res.render('sellerUtils/dataGridReload',{products:listedProducts,currentPageNo:Math.min(currentPage,maxPageCount),lastPageNo:maxPageCount});
    }catch(err){
        console.log('Error while deleting product',err.stack);
        await transactionSession.abortTransaction();
        await transactionSession.endSession();
        return res.json({
            success:false,
            message:err.message,
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

// search product functionality
exports.searchListedProduct = async(req,res,next)=>{
    const {medicineId} = req.body;
    // check does product exists
    const userId = req.user._id;
    try{
        const isGeniuneId = await centralMedicineDB.findOne({productId:medicineId}).select('_id');
        if(!isGeniuneId){
            throw new Error('Invalid Product Selected');
        }
        //check does user owns this product
        let isListedByOwner = await productDB.findOne({sellerId:userId,productId:isGeniuneId._id}).select('productId quantity price -_id').populate('productId','productId name useOf productForm manufacturer -_id');
        if(!isListedByOwner){
            throw new Error('Medicine Not listed');
        }
        isListedByOwner = [isListedByOwner];
        return res.render('sellerUtils/dataGridReload',{products:isListedByOwner,currentPageNo:1,lastPageNo:1});
    }catch(err){
        console.log('Error while searching product');
        return res.status(400).json({
            success:false,
            message:err.message,
        });
    }
}