const express = require('express');
const router = express.Router();
const authController = require('../../controllers/LoginSignupController/signup');
const {check} = require('express-validator');
const {upload} = require('../../main');
const validations = require('../../utils/input validations/checks');
router.get('/customer',authController.getSignUpPage);
// router.get('/customer',authController.getSignUpPage);
router.post('/generate-email-otp',authController.emailOtpSession);
router.post('/email-otp-validation',authController.emailOtpValidation);
// router.post('/generate-mobile-otp',authController.mobileNumberOtpSession);
// router.post('/mobile-otp-validation',authController.mobileNumberOtpValidation);

router.post('/customer',[
    validations.nameValidation('customerName'),
    validations.emailValidation('emailId'),
    validations.mobileNumberValidation('mobileNo'),
    validations.passwordValidation('password'),
    // validations.confirmPassword('confirm-password'),
],authController.postCustomerSignup);

router.get('/seller',authController.getSellerSignupPage);


router.post('/seller',upload.fields([
    { name: 'storeLogo', maxCount :1 },
    { name: 'headerLogoForPdf', maxCount : 1 },
    { name: 'footerLogoForPdf', maxCount : 1 },
]),[
    validations.dnl('drugLicenseNumber'),
    validations.gst('gstRegistrationNumber'),
    validations.fssai('fssaiLicenseNumber'),
    validations.imageFileValidation('storeLogo'),
    validations.imageFileValidation('headerLogoForPdf'),
    validations.imageFileValidation('footerLogoForPdf'),
    validations.pincodeValidation('shopPincode','shopState','shopCity'),
    validations.nameValidation('sellerName'),
    validations.emailValidation('sellerEmailId'),
    validations.passwordValidation('sellerPassword'),
    validations.mobileNumberValidation('sellerMobileNo'),
    validations.nameValidation('storeName'),
    validations.activeDayTimeValidation('activeTime'),
    validations.addressValidation('line1Address'),
    validations.addressValidation('line2Address'),
]
,authController.postSellerSignup);





module.exports = router;