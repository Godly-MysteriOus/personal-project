const app = require('express');
const limiter = require('../../utils/rateLimit/rateLimiter');
const router = app.Router();
const authRoute = require('../../middleware/authentication');
const customerController = require('../../controllers/userControllers/customerController');


router.get('/homePage',authRoute.customerAuthentication,limiter,customerController.getHomePage);
router.post('/save-address',authRoute.customerAuthentication,limiter,customerController.saveUserAddress);
router.get('/profile',authRoute.customerAuthentication,limiter,customerController.getProfilePage);
router.get('/cart',authRoute.customerAuthentication,limiter,customerController.getCartPage);
router.get('/cart-products',authRoute.customerAuthentication,limiter,customerController.getCartProduct);
router.post('/add-to-cart',authRoute.customerAuthentication,limiter,customerController.postAddToCart);


// util routes
router.get('/user-addresses',authRoute.customerAuthentication,limiter,customerController.getUserAddresses);
router.post('/search-product',authRoute.customerAuthentication,limiter,customerController.searchListedProducts);
router.get('/get-saved-locations',authRoute.customerAuthentication,limiter,customerController.getAllAddress);
router.post('/update-active-address',authRoute.customerAuthentication,limiter,customerController.postUpdateActiveAddress);
router.post('/quantity-add',authRoute.customerAuthentication,limiter,customerController.increaseProductQuantity);
router.post('/quantity-reduce',authRoute.customerAuthentication,limiter,customerController.reduceProductQuantity);
router.post('/delete-product',authRoute.customerAuthentication,limiter,customerController.deleteProduct);
module.exports = router;