const app = require('express');
const router = app.Router();
const authRoute = require('../../middleware/authentication');
const customerController = require('../../controllers/userControllers/customerController');


router.get('/homePage',authRoute.customerAuthentication,customerController.getHomePage);
router.post('/save-address',authRoute.customerAuthentication,customerController.saveUserAddress);
router.get('/profile',authRoute.customerAuthentication,customerController.getProfilePage);
router.get('/cart',authRoute.customerAuthentication,customerController.getCartPage);
router.get('/cart-products',authRoute.customerAuthentication,customerController.getCartProduct);
router.post('/add-to-cart',authRoute.customerAuthentication,customerController.postAddToCart);


// util routes
router.get('/user-addresses',authRoute.customerAuthentication,customerController.getUserAddresses);
router.post('/search-product',authRoute.customerAuthentication,customerController.searchListedProducts);
router.get('/get-saved-locations',authRoute.customerAuthentication,customerController.getAllAddress);
router.post('/update-active-address',authRoute.customerAuthentication,customerController.postUpdateActiveAddress);
router.post('/quantity-add',authRoute.customerAuthentication,customerController.increaseProductQuantity);
router.post('/quantity-reduce',authRoute.customerAuthentication,customerController.reduceProductQuantity);
router.post('/delete-product',authRoute.customerAuthentication,customerController.deleteProduct);
module.exports = router;