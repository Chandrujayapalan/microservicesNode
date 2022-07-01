const User = require('../model/userModel')
const bycrpt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userVerify = require('../model/userverifed')
const nodemailer = require('nodemailer')
const { v4: uuidv4 } = require('uuid')
const path = require('path')
require('dotenv').config()
let transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    }
})
transport.verify((error, success) => {
    if (error) {
        console.log(error)
    } else {
        console.log("READY TO MESSAGE")
        console.log(success)
    }

})
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
                email: req.body.email,
                password: hashedPass,
                userType: 1,
                verifed: false

            })
            let exitUser = await User.findOne({
                $or: [{ email: req.body.email }, { phone: req.body.phone }]
            })
            if (exitUser) {

                res.json({
                    Status: 200,
                    message: "Already registered"

                })
            } else {
                await user.save()
                // var result = {
                //     name: user.name,
                //     email: user.email,
                //     phone: user.phone,
                //     password : user.password
                // }
                // res.json({
                //     Status: 200,
                //     message: 'Added successfully',
                //     data: result 

                // })
                sendVerificationEmail(user, res)

            }
            //    res.json({
            //             Status: 200,
            //             message: "registered"

            //         })

        })

    }
    catch (error) {
        res.json({
            message: error.message
        })
    }
}

const sendVerificationEmail = ({ _id, email }, res) => {
    try {
        const confirmUrl = "http://localhost:8000/"
        const uniqueString = uuidv4() + _id
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Verify Your Email",
            html: `<p>Verify ypur email  address to complete the signUp and loginto  your account </p><p>the link <b>expiresIn in in 6 hours</b>.</p> 
        <p>press <a href=${confirmUrl + "api/verify/" + _id + "/" + uniqueString}>here </a> to proceed</p>`
        }

        // const saltRound = 10;
        // bycrpt.hash(uniqueString, saltRound)
        bycrpt.hash(uniqueString, 10, async function (err, hashUniqueString) {
            if (err) {
                res.json({
                    error: err
                })
            }
            const newVerification = new userVerify({
                userId: _id,
                uniqueString: hashUniqueString,
                createdAt: Date.now(),
                expriesAt: Date.now() + 2160000,
            })

            await newVerification.save()
            transport.sendMail(mailOptions)
            res.json({
                status: "pending",
                message: "Verifation are email sent "
            })
        })
    }

    catch (error) {
        res.json({
            status: "failed",
            message: "varification  email failed data"


        })
    }
}
// }
//         .then((hashUniqueString) => {
//             const newVerification = new userVerify({
//                 userId: _id,
//                 uniqueString: hashUniqueString,
//                 createdAt: Date.now(),
//                 expriesAt: Date.now() + 2160000,
//             })
//             newVerification.save()
//                 .then(() => {
//                     transport.sendMail(mailOptions)
//                         .then(() => {
//                             res.json({
//                                 status: "pending",
//                                 message: "Verifation are email sent "
//                             })
//                         })
//                         .catch(() => {
//                             res.json({
//                                 status: "failed",
//                                 message: "varification  email failed"
//                             })
//                         })
//                 })

//                 .catch((error) => {
//                     console.log(error)
//                     res.json({
//                         status: "failed",
//                         message: "coun't  save vaerifaiton"
//                     })

//                 })
//                 .catch(() => {
//                     res.json({
//                         status: "failed",
//                         message: "varification  email failed data"


//                     })
//                 })
//         })
// }


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
        //if (user.verifed === false) {
            if (!user[1].verifed) {
            res.json({
                status: "failed",
                message: "Email hasn't been verifed"
            })
        }
        else {
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
        console.log(user)
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
        let user = await User.find({ _id: { $in: req.body.ids } })
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
const verifys = async (req, res, next) => {
    try {
        let { userId, uniqueString } = req.params
        let result = await userVerify.find({ userId })
        if (result.length > 0) {
            const { expriesAt } = result[0]
            const hashUniqueString = result[0].uniqueString
            if (expriesAt < Date.now()) {
                await userVerify.deleteOne({ userId })
                await User.deleteOne({ _id: userId })

                let message = "link has expired register again"
                res.redirect(`/api/verfied/error=true&message=${message}`)

            }
            else {
                bycrpt.compare(uniqueString, hashUniqueString, async  (err, result) => {
                    //   let result = bycrpt.compare(uniqueString, hashUniqueString)

                    if (result) {
                        await User.updateOne({ _id: userId }, { verifed: true })

                        await userVerify.deleteOne({ userId })

                        res.sendFile(path.join(__dirname, "./../views/verified.html"))


                    } else {
                        let message = "ivaliddetails  passed .check in inbox "
                        res.redirect(`/api/verfied/error=true&message=${message}`)
                    }
                })
            }
        }
        else {

            let message = "already verifed login "
            res.redirect(`/api/verfied/error=true&message=${message}`)
        }
    } catch (error) {
        console.log(error)
        let message = "an errror  check record"
        res.redirect(`/api/verfied/error=true&message=${message}`)
    }
}
const verifed = async (req, res, next) => {
    try {
        res.sendFile(path.join(__dirname, './../views/verified.html'))
    } catch (error) {

    }
}
module.exports = { register, login, userget, verifys, verifed }