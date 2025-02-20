const express = require('express');
const router = express.Router();
const authRoute = require('../../middleware/authentication');
const productController = require('../../controllers/sellerControllers/productActions');
const accountController = require('../../controllers/sellerControllers/accountManagementAction');
const salesController = require('../../controllers/sellerControllers/salesAction');
// product related routes
router.get('/listed-products',authRoute.sellerAuthentication,productController.getListedProducts);
router.post('/delete-product:productId',authRoute.sellerAuthentication,productController.postDeleteProduct);

//add single product
router.get('/add-product',authRoute.sellerAuthentication,productController.getAddProduct);
router.post('/add-product',authRoute.sellerAuthentication,productController.postAddProduct);

// edit product
router.get('/edit-product:productId',authRoute.sellerAuthentication,productController.getEditProduct);
router.post('/edit-product',authRoute.sellerAuthentication,productController.postEditProduct);

//add bulk product
router.get('/add-bulk-products',authRoute.sellerAuthentication,productController.getBulkUpload);
router.post('/add-bulk-products',authRoute.sellerAuthentication,productController.postBulkAddProduct);

// shop data related routes // logic yet to be created
// router.get('/create-order',authRoute.sellerAuthentication,productController);

// router.get('/checkout',authRoute.sellerAuthentication,salesController);
// router.post('/checkout',authRoute.sellerAuthentication,salesController);
// router.get('/active-orders',authRoute.sellerAuthentication,salesController);
// router.get('/active-order:orderId',authRoute.sellerAuthentication,salesController);
// router.post('/active-order/accept:orderId',authRoute.sellerAuthentication,salesController);
// router.post('/active-order/reject:orderId',authRoute.sellerAuthentication,salesController);
// // make route for accept or reject order
// router.get('/sales',authRoute.sellerAuthentication,salesController);
// router.get('/sales:saleId',authRoute.sellerAuthentication,salesController);
// router.get('/analytics',authRoute.sellerAuthentication,salesController);


// router.get('/accounts',authRoute.sellerAuthentication,accountController);


//utility routes
router.post('/get-listed-product',authRoute.sellerAuthentication,productController.getListedProducts);


module.exports = router;