const Admin = require('../model/adminSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SignUp = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        if(!username || !password || !email){
            return res.status(400).json({ message: "Username, password and email are required"})
        }

        const isExist = await Admin.findOne({email: email})

        if(isExist){
            return res.status(200).json({ message: "Admin Already exists"})
        }

        hashedpassword = await bcrypt.hash(password, 10)

        const newAdmin = new Admin({
            userName: username,
            email: email,
            password: hashedpassword
        })
        await newAdmin.save()

        return res.status(201).json({nessage: "Signup successful, proceed to login", newAdmin})
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({nessage: "Could not signUp Admin"})  
    }
 }

const logIn = async (req, res) => {
    try {
        const { password, email } = req.body;

        if(!password || !email){
            return res.status(400).json({ message: "password and email are required"})
        }

        const isExist = await Admin.findOne({email: email})

        if(!isExist){
            return res.status(200).json({ message: "Admin not found"})
        }

        const isMatch = await bcrypt.compare(password, isExist.password)

        if(!isMatch){
            return res.status(400).json({ message: "Authentication failed"})
        }
        
        const token = jwt.sign({
            email: email,
            role: isExist.role
        },
        process.env.JWT_ADMIN_SECRET, {expiresIn: '2h'})

        return res.status(200).json({message: "Logged In successful", token})
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({ message: "Login Failed"})
    }
}


module.exports = { SignUp, logIn }