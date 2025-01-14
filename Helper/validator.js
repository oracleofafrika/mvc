const validator = require('validator');

const validation = async (req, res, next) => {
    try {
        const {userNamer, password, email} = req.body

        if(!validator.isLength(userNamer, {min: 7, max: 30})) {
            return res.status(400).json({msg: 'Username must be between 7 and 30 characters long'})
        }

        if(!validator.isEmail(email)) {
            return res.status(400).json({msg: 'Invalid email format' })
        }

        if (!validator.isStrongPassword(password, {minLength: 8, lowercase: 1, uppercase:1, numbers: 1, specialCharacters: 1 })){
            return res.status(400).json({msg: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lower case letter, one numbers and one special characters'})
        }
        next()
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: 'Error Validating User'})
        
    }
}