const User = require('../model/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const crypto = require('crypto');
const port = process.env.PORT 
const cloudinary = require('../Utils/cloudinary');


const SignUp = async (req, res) => {
    try {
        const {userName, password, email, confirmPassword, profilepic} = req.body;

        if(password !== confirmPassword){
            return res.status(400).json({msg: 'Password do not match'});
        }

        const existingUser = await User.findOne({ email: email});

        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(req.file);
        


        const result = await cloudinary.uploader.upload(req.file.path)

        const user = new User({
            userName,
            password: hashedPassword,
            email,
            profilepic: result.secure_url
        });

        console.log(user);
        

        await user.save();

        const transporter  = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL,
                pass: process.env.MAIL_PASS,
            },
        });

         // Define the email options
         const mailOPtions = {
             from: process.env.MAIL,
             to: `${user.email}`,
             subject: 'Hello from OSF',
             text: `Hello ${user.userName}, Thank you for signing up with us.`,
         };

        // Sending reminder email every 5 minutes

        //  cron.schedule('5 * * * *', () => {
        //      console.log('Sending reminder email every 5 minutes');
            
        //  });

        // Send the email
        transporter.sendMail(mailOPtions, (error, info) => {
            if(error) {
                console.log('Error occured:', error); 
            } else {
                console.log('Email  sent', info.response);
                
            }
        })
        res.status(201).json({message: 'User saved successfully'})
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({message:'internal server error'});
        
    }
}

const logIn = async (req, res) => {
    try {
        const {email, password} = req.body;

        const isUser = await User.findOne({email:email});
         

        if (!isUser){
            return res.status(404).json({message: 'User should signup first'});
        }

        const userMatch = await bcrypt.compare(password, isUser.password)

        if(!userMatch){
            return res.status(401).json({message: 'Invalid credientials'});
        }

        // const userInfo = {
        //     email: User.email,
        //     password: User.password
        // }

        const payload = { 
            id: isUser._id,
            password: isUser.password
        }

        const token = jwt.sign(payload, process.env.JWT_USER_SECRET, {expiresIn: '1h'});

        return res.status(200).json({message:'successful login', token: token});
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({message:'internal server error'});
        
    }
}

const AllUsers = async (req, res) => {
    try {
        const user = await User.find({})

        return res.status(200).json({message: 'these are the users', user});
    } catch (error) {
        console.log();

        return res.status(500).json({message: "error"});
        
    }
}

const forgotPassword = async (req, res) => {
    try {
        const {email} = req.body;

        const user = await User.findOne({email});

        if(!user) {
            return res.status(404).json({msg: 'User not found'});
        }

        const token = await crypto.randomBytes(32).toString('hex');

            user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000; // 1 hour

        await user.save();


        const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASS,
    
    
    },
});

//  Define tge email options
const mailOptions = {
    from: process.env.MAIL,
    to: `${user.email}`,
    subject: "Password reset from OSF",
    text: `Hello ${user.userName}, You are receiving this because you (or someone else) have requested for the reset of your account. Please click on the following link, or paste this into your browser to complete the process:
    http://localhost:${port}/api/v1/users/reset/${token}
    If you did not request this, please ignore this email and your password will remain unchanged.`
}

//  Send the email 

transporter.sendMail(mailOptions, (error,info) => {
    if(error) {
        console.log('Error occured:', error);
        
    } else {
        console.log('Email sent:', info.response);
        
    }
});

return res.status(200).json({msg: 'reset token sent'})


} catch (error) {
    console.log(error);
    
    return res.status(500).json({msg: 'Internal Server Error'})
}}


const resetPassword = async (req, res) => {
    try {
        const token = req.params.token;

        const {password} = req.body;

        const user = await User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})

        if(!user) {
            return res.status(400).json({msg: 'Invalid token or expired'});
        }

        const  hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.resetToken = undefined,
        user.resetTokenExpiration = undefined;

        await user.save();

        return res.status(200).json({msg: 'Password reset successful'});
    } catch (error) {
        return res.status(500).json({msg: 'Internal Server Error'});
        
    }
}


const sendMail = async () => {
    try {
        
    } catch (error) {
        
    }
}

module.exports = { SignUp, logIn, AllUsers, forgotPassword, resetPassword }