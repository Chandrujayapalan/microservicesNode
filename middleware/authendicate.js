const jwt = require('jsonwebtoken');
require('dotenv').config();
const authenticating = (req, res, next) => {
    try {
     
       
        const token = req.headers.authorization.split(' ')[1]
        
        const decode = jwt.verify(token, process.env.TOKEN_KEY)
         req.user = decode
        next()
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        })
    }
}
const admin = (req, res, next) => {
    try {
        let check = req.user.userType
        if (check === 2){
            next()
        }else{
            res.status(403).json({
                status : 403,
                message: 'forbidden'
            })
        }
    }
    catch (error) {
        res.json({
            message: error
        })
    }
}
module.exports = { authenticating, admin }