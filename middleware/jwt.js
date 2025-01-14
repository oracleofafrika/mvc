const jwt = require('jsonwebtoken');

const userAuthenticated = async (req, res, next) => {
    try {
        const token = await req.headers.authorization.split(" ")[1];
        if(!token){
            return res.status(401).json({message: 'User not Authorized'});
        }
        const data = jwt.verify(token, process.env.JWT_USER_SECRET);
        if (!data){
            return res.status(403).json({message: 'Invalid Token'});
        }
        req.user = data;
        next();
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({message: 'Internal Error'});
    }
}

const adminAuthenticated = async (req, res, next) => {
    try {
        const token = await req.headers.authorization.split(" ")[1];
        if(!token){
            return res.status(401).json({message: 'User not Authorized'});
        }
        const data = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
        if (!data){
            return res.status(403).json({message: 'Invalid Token'});
        }
        req.user = data;
        next();
    } catch (error) {
        console.log(error);
        return res.status(403).json({message: 'Forbidden Access' });
    }
}

module.exports = { userAuthenticated, adminAuthenticated };