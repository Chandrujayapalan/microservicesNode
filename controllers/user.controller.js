const path = require('path');
const { userService } = require('../services');
const excelToJson = require('convert-excel-to-json')
const excel = require('exceljs')

require('dotenv').config();
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


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



class userController { }
userController.prototype.signup = async (req, res, next) => {
    try {
        console.log(req.body.password, "req.body.password");
        let saltRounds = 10
        bcrypt.genSalt(saltRounds, function (err, salt) {
            console.log(salt)
            bcrypt.hash(req.body.password, salt, async function (err, hashedPass) {
                if (err) {
                    res.json({
                        error: err
                    })
                }
                let exitUser = await userService.findUser({ emailId: req.body.emailId })
                if (exitUser) {

                    res.status(400).json({
                        Status: 400,
                        message: "Already registered"

                    })
                } else {
                    let user = await userService.createUserMaster({
                        emailId: req.body.emailId,
                        password: hashedPass,
                    })
                    res.json({
                        Status: 200,
                        message: 'Added successfully',
                        user

                    })

                }
            })
        })
    }


    catch (error) {
        console.log(error)
        return next(error)
    }
}



userController.prototype.login = async (req, res, next) => {
    try {

        let username = req.body.emailId
        let password = req.body.password
        // let product = await User.findOne({ $or: [{ email: username }, { phone: username }] })
        let user = await userService.findUser({ emailId: username })
        //if (user.verifed === false) {

        console.log(password, user.password)
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    res.json({
                        error: err
                    })
                }
                console.log(password)
                console.log(user.password)
                console.log(result)
                if (result) {
                    console.log(user.userId)
                    let token = jwt.sign({ id: user.userId }, process.env.TOKEN_KEY, { expiresIn: '24hr' })
                    res.json({
                        status: 200,
                        message: 'login Successful',
                        token
                    })
                }
                else {
                    res.json({
                        message: "password no match"
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
        next(error)
    }
}

userController.prototype.uploadproducts = async (req, res, next) => {
    try {
        const file = req.file.path
        let result = excelToJson({
            sourceFile: file,
            header: {
                rows: 1
            },
            columnToKey: {
                A: 'productsName',
                B: 'productPrice',
                C: 'productDescription',
                D: 'productReviews'
            }
        })
        console.log(result)
        result = await userService.uploadproduct(result.Sheet1)
        console.log(result.Sheet1)
        res.json({
            status: 200,
            message: 'Added successfully',
            result
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: error.message
        })
    }
}

userController.prototype.orderplace = async (req, res, next) => {

    try {

        let result = await userService.orderplays({ id: req.body.items })
        let totalCost = 0
        let items = []

        result.map(a => {
            totalCost += a.productPrice
            items.push({
                productsName: a.productsName,
                productPrice: a.productPrice,
                productReviews: a.productReviews

            })

        })

        console.log(items);
        result = await userService.orderplacee({
            items: items,
            userId: req.user.id,
            total: totalCost,
            date: req.body.date,
            deleted: req.body.deleted

        })
        res.json({
            status: 200,
            data: result
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: error.message
        })
    }
}
userController.prototype.updateOrder = async (req, res, next) => {

    try {
        let result = await userService.orderplays({ id: req.body.items })
        let totalCost = 0

        result.map(a => {
            totalCost += a.productPrice
        })
        console.log(result);
        let product = {
            items: req.body.items,
            total: totalCost
        }
        console.log(result)
        result = await userService.updateorders(product, { id: req.body.itemId })
        console.log(result)
        res.json({
            status: 200,
            data: result
        })
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}
userController.prototype.deleteOrder = async (req, res, next) => {
    try {
        let userId = req.body.orderId
        let result = await userService.findorder({ id: userId })
        console.log(result);
        //  let order = result.id
        //  console.log(order);
        if (await userService.deleteorder({ id: req.body.orderId }, result)) {
            res.json({
                status: 200,
                data: "deleted"
            })
        }
        else {
            res.json({
                status: 200,
                data: "no order"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: error.message
        })
    }
}
userController.prototype.deleteBoolean = async (req, res, next) => {
    try {
        //   let userId = req.body.orderId
        let result = await userService.findboolean({ id: req.body.orderId })
        console.log(result);
        let order = {
            deleted: req.body.deleted
        }
        result = await userService.updateBoolean(order, { id: req.body.orderId })
        res.json({
            status: 200,
            data: result
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: error.message
        })
    }
}
userController.prototype.getorder = async (req, res, next) => {
    try {
        let result = await userService.findorder1({ userId: req.user.id, deleted: 0 })
        console.log(result);
        res.json({
            status: 200,
            data: result
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: error.message
        })
    }
}
userController.prototype.userListOrder = async (req, res, next) => {

    try {
        let decodedValue = await userService.findorder1({ userId: req.user.id, deleted: 0 })
        console.log(decodedValue)
        decodedValue = decodedValue.map(value => {
            return {
                ...value,
                items: JSON.parse(value.items)
            }
        })
        res.json({
            status: 200,
            data: decodedValue
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: error.message
        })
    }
}
userController.prototype.listorder = async (req, res, next) => {
    try {
        let result = await userService.findorder1({ userId: req.user.id, deleted: 0 })

        result =
            console.log(result);
        res.json({
            status: 200,
            data: result
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: error.message
        })
    }
}

userController.prototype.listProduct = async (req, res, next) => {
    try {
        let result = await userService.findproduct1({ [Op.or]: [{ productsName: { [Op.like]: `%${req.query.search}%` } }, { productDescription: { [Op.like]: `%${req.query.search}%` } }] })

        res.json({
            status: 200,
            data: result
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: error.message
        })
    }
}
userController.prototype.fileDownload = async (req, res, next) => {

    let workbook = new excel.Workbook();

    let worksheet = workbook.addWorksheet("order");

    const path = "./files";
    worksheet.columns = [
        { header: "id", key: "id", width: 10 },
        { header: "items", key: "items", width: 100 },
        { header: "total", key: "total", width: 25 },
        { header: "userId", key: "userId", width: 10 },
        { header: "deleted", key: "deleted", width: 5 },
        { header: "createdAt", key: "createdAt", width: 10 },
        { header: "deleted", key: "updatedAt", width: 10 },
    ];

    let result = await userService.findorder()
    result = result.map(value => {
        return {
            ...value
        }
    })

    worksheet.addRows(result);

    worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
    });

    try {
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        await workbook.xlsx.writeFile(`${path}/users.xlsx`)
        // res.setHeader("Content-Disposition", `attachment; filename=users.xlsx`);
        // res.end();
        await workbook.xlsx.write(res)
        res.end()
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: error.message
        })

    }

}
userController.prototype.sendVerificationEmail = async (req, res, next) => {
    try {
      
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: req.body.email,
            subject: "gmail",
            attachments: [
                {
                    filename: 'users.xlsx',
                    path: './files/users.xlsx'
                }
            ]
        }
        transport.sendMail(mailOptions)
        res.json({
            status: 200,
            message: "email sent "
        })

    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: error.message
        })
    }
}
module.exports = new userController()