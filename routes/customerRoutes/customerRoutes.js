const app = require('express');
const router = app.Router();
const authRoute = require('../../middleware/authentication');
const customerController = require('../../controllers/userControllers/customerController');
router.get('/homePage',authRoute.customerAuthentication,customerController.getHomePage);

module.exports = router;