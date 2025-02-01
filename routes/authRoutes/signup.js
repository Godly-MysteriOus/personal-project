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
// router.get('/seller',);
router.post('/seller',[
    check('drug-license-number').custom(val=>{
        const DLNRegex = /^(0[1-9]|[1-2][0-9]|3[0-5])-([0-9]{8})$/;
        if(!DLNRegex.test(val)){
            throw new Error('Invalid Drug Lincense number format');
        }
    }),
    check('gst-number').custom(val=>{
        const gstRegex = /^(0[1-9]|[1-2][0-9]|3[0-7])[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
        if(!gstRegex.test(val)){
            throw new Error('Invalid GST Number Format');
        }
    }),
    check('fssai-number').custom(val=>{
        const stateCodes = ["AN", "AP", "AR", "AS", "BR", "CH", "CT", "DN", "DD", "DL", "GA", "GJ", "HR", "HP", "JK", "JH", "KA", "KL", "LD", "MP", "MH", "MN", "ML", "MZ", "NL", "OD", "PB", "RJ", "SK", "TN", "TS", "UP", "UK", "WB", "AR", "TR", "CG", "OD"];
        const fssaiRegex = /^[A-Z]{2}[0-9]{7}[A-Za-z0-9]{0,4}$/;
        if(!fssaiRegex.test(val)){
            throw new Error('Invalid FSSAI License Number format');
        }
        if(!stateCodes.find(String(val).substring(0,2))){
            throw new Error('Invalid State Code');
        }
    }),
    validations.addressValidation_stateCityPincode('state','city','pincode'),
    validations.nameValidation('owner-name'),
    validations.emailValidation('emailId'),
    validations.passwordValidation('password'),
    validations.mobileNumberValidation('mobile-number'),
    validations.timeValidation('opening-hours'),
    validations.timeValidation('closing-hours'),
]
,authController.postSellerSignup);





module.exports = router;