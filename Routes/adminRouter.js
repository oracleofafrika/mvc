const { SignUp } = require('../controller/adminController.js');
const { logIn } = require('../controller/adminController.js');
const router = require('express').Router();


router.post('/signup', SignUp);

router.post('/login', logIn);


module.exports = router;