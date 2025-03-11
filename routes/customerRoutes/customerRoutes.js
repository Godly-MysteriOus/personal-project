const app = require('express');
const router = app.Router();
const authRoute = require('../../middleware/authentication');
const customerController = require('../../controllers/userControllers/customerController');


router.get('/homePage',authRoute.customerAuthentication,customerController.getHomePage);
router.post('/homePage-search-product',authRoute.customerAuthentication,customerController.searchListedProducts);
module.exports = router;