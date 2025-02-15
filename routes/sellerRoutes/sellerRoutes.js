const express = require('express');
const router = express.Router();
const productController = require('../../controllers/sellerControllers/productActions');
const accountController = require('../../controllers/sellerControllers/accountManagementAction');
const salesController = require('../../controllers/sellerControllers/salesAction');
// product related routes
router.get('/listed-products',productController.getListedProducts);
router.post('/delete-product:productId',productController.postDeleteProduct);

//add single product
router.get('/add-product',productController.getAddProduct);
router.post('/add-product',productController.postAddProduct);

// edit product
router.get('/edit-product:productId',productController.getEditProduct);
router.post('/edit-product',productController.postEditProduct);

//add bulk product
router.get('/add-bulk-products',productController.getBulkUpload);
router.post('/add-bulk-products',productController.postBulkAddProduct);

// shop data related routes
router.post('/edit-detail');
router.post();
module.exports = router;