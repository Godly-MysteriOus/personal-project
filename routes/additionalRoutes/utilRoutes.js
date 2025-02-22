const express = require('express');
const router = express.Router();

const utilController = require('../../utils/apiCalls/apis');

router.get('/statesOfIndia',utilController.getAllStatesOfIndia);

router.post('/cityOfState',utilController.getAllCitiesOfState);

router.post('/pincode',utilController.getPincodeValidation);

router.post('/searchProduct',utilController.searchBarSellerAddProduct);

router.get('/listedProduct',utilController.searchBarSellerListedProduct);

module.exports = router;