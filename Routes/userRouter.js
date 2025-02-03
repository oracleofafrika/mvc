const express = require('express');

const Auth = require('../middleware/jwt');
const { SignUp, logIn, AllUsers, forgotPassword, resetPassword } = require('../controller/userController');
const upload = require('../middleware/multer')





const router = express.Router();

router.post('/signUp', upload.single('image'), SignUp)
router.post('/Login', logIn)
router.get('/get_all', Auth.adminAuthenticated, AllUsers)
router.post('/forgotpass', forgotPassword)
router.post('/resetpass/:token', resetPassword)

module.exports = router;