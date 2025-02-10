const express = require('express');
const router = express.Router();
const authController = require('../../controllers/LoginSignupController/signup');
const {check} = require('express-validator');

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


router.post('/seller',[
    check('drugLicenseNumber').custom(val=>{
        const DLNRegex = /^([0][1-9]|[1-2][0-9]|[3][0-5])([2][0-1](B|C)?)([0-9]{5,6})$/;
        if(!DLNRegex.test(val)){
            throw new Error('Invalid Drug Lincense number format');
        }
    }),
    check('gstRegistrationNumber').custom(val=>{
        const gstRegex = /^([0][1-9]|[1-3][0-9])[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z][Z][A-Z0-9]$/;
        if(!gstRegex.test(val)){
            throw new Error('Invalid GST Number Format');
        }
    }),
    check('fssaiLicenseNumber').custom(val=>{
        const fssaiRegex = /^[1-2]([0][1-9]|[1-2][0-9]|3[0-5])[0-9]{2}[0-9]{2}[1-9][0-9]{5}[1-9]$/;
        if(!fssaiRegex.test(val)){
            throw new Error('Invalid FSSAI License Number format');
        }
    }),
    validations.pincodeValidation('state','city','pincode'),
    validations.nameValidation('sellerName'),
    validations.emailValidation('emailId'),
    validations.passwordValidation('password'),
    validations.mobileNumberValidation('mobileNo'),
    validations.nameValidation('storeName'),
    // add for address and figure out time validation
    // validations.timeValidation('opening-hours'),
    // validations.timeValidation('closing-hours'),
]
,authController.postSellerSignup);





module.exports = router;