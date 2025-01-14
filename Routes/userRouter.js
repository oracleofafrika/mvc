const express = require('express');
const { SignUp } = require('../controller/userController');
const { logIn } = require('../controller/userController');
const Auth = require('../middleware/jwt');
const { AllUsers } = require('../controller/userController');



const router = express.Router();

router.post('/signUp', SignUp)
router.post('/Login', logIn)
router.get('/get_all', Auth.adminAuthenticated, AllUsers)

module.exports = router;