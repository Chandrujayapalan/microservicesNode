const User = require('../model/userModel')
const bycrpt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const register = (req, res, next) => {
    try {
        bycrpt.hash(req.body.password, 10, async function (err, hashedPass) {
            if (err) {
                res.json({
                    error: err
                })
            }
            let user = new User({
                name: req.body.name,
                phone: req.body.phone,
                gender: req.body.gender,
                DoB: req.body.DoB,
                email: req.body.email,
                password: hashedPass,
                userType: 1
            })
            let exitUser = await User.findOne({
                $or: [{ email : req.body.email }, { phone :  req.body.phone }]
              })
              if (exitUser) {
                console.log("already registered");
              } else {
            await user.save()
            s  
            if (user) {
                var result = {
                    name: user.name,
                    email: user.email,
                    phone: user.phone
                }
                res.json({
                    Status: 200,
                    message: 'Added successfully',
                    data: result 

                })
            }
        }
        res.json({
            Status: 200,
            message: "Already registered"

        })
        })
    
    }
    catch (error) {
        res.json({
            message: error.message
        })
    }
}
const login = async (req, res, next) => {
    try {
        console.log("user", req.body.username)
        let username = req.body.username
        let password = req.body.password
        let types = {}
        if (typeof username === 'string') {
            types = { email: username }
        }
        else if (typeof username === 'number') {
            types = { phone: username }
        }
        console.log(types)
        let user = await User.findOne(types)
        console.log(user)
        // let product = await User.findOne({ $or: [{ email: username }, { phone: username }] })
        if (user) {
            bycrpt.compare(password, user.password, (err, result) => {
                if (err) {
                    res.json({
                        error: err
                    })
                }
                if (result) {
                    let token = jwt.sign({ id: user.id, userType: user.userType }, process.env.TOKEN_KEY, { expiresIn: '24hr' })
                    res.json({
                        status: 200,
                        message: 'login Successful',
                        token
                    })
                }
                else {
                    res.json({
                        message: 'password does not match'
                    })
                }
            })
        } else {
            res.json({
                message: 'no user found'
            })
        }
    }
    catch (error) {
        console.log(error)
        res.json({
            message: error.message
        })
    }
}
const userget = async (req, res, next) => {
    try {
        let user = await User.find({ _id: {$in  : req.body.ids} })
        res.json({
            status: 200,
            data: user
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: error.message
        })
    }
}
module.exports = { register, login  ,userget }