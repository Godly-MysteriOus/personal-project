const express = require('express');
const router = express.Router();
const featureController = require('../../controllers/FeatureControllers/feature');

const validations = require('../../utils/input validations/checks');
router.post('/userQuery',[
    validations.emailValidation('emailId'),
    validations.mobileNumberValidation('mobileNo'),
],featureController.postUserQuery);

module.exports = router;