const app = require('express');
const router = app.Router();
const authRoute = require('../../middleware/authentication');
const customerController = require('../../controllers/userControllers/customerController');


router.get('/homePage',authRoute.customerAuthentication,customerController.getHomePage);
router.post('/save-address',authRoute.customerAuthentication,customerController.saveUserAddress);
router.get('/profile',authRoute.customerAuthentication,customerController.getProfilePage);
router.get('/cart',authRoute.customerAuthentication,customerController.getCartPage);



// util routes
router.get('/user-addresses',authRoute.customerAuthentication,customerController.getUserAddresses);
router.post('/homePage-search-product',authRoute.customerAuthentication,customerController.searchListedProducts);
router.post('/user-locations',authRoute.customerAuthentication,customerController.userLocations);
module.exports = router;