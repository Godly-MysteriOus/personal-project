const express = require('express');
const router = express.Router();
const loginAuthController = require('../../controllers/LoginSignupController/login&logout');

const validations = require('../../utils/input validations/checks');

// render the login page
router.get('/login',loginAuthController.getLogin);

// redirects to home page
router.post('/login',[validations.emailValidation('credentialField')],loginAuthController.postLogin);

//redirects to login page
router.post('/logout',loginAuthController.postLogout);

//delete user and redirects to signup page
router.post('/delete-account',loginAuthController.deleteUser);

module.exports = router;