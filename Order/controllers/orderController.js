const { productget, Userget } = require('../interServices/index')
const Orders = require('../model/orderModel')
const orderplace = async (req, res, next) => {

    try {
        let result = await productget(req.body.items)
        let totalCost = 0
        result.map(a => {
            totalCost += a.productPrice
        })
        console.log(req.user)
        result = new Orders({
            items: req.body.items,
            userId: req.user.id,
            total: totalCost,
            date: req.body.date
        })
        console.log(result)
        await result.save()
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

const updateOrder = async (req, res, next) => {

    try {


        let totalCost = 0
        let result = await productget(req.body.items)
        result.map(a => {
            totalCost += a.productPrice
        })
        let userId = req.user.id
        let product = {
            items: req.body.items,
            total: totalCost,
            date: req.body.date
        }
        result = await Orders.findByIdAndUpdate({ _id: req.body.itemid }, { $set: product }, { new: true })
        console.log(userId)
        console.log(req.user)
        console.log(totalCost)
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
const deleteOrder = async (req, res, next) => {
    try {
        let userId = req.body.orderId

        if (await Orders.findByIdAndRemove(userId)) {
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
        res.status(400).json({
            message: error.message
        })
    }
}
const date = async (req, res, next) => {
    try {
        let order = await Orders.find({ "$or": [{ date: req.body.date }] })
        console.log(order)
        res.send(order)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}
const listorder = async (req, res, next) => {
    try {

        // let order = await Orders.find({ "$or": [{ userId: req.user.id }] })
        let orders = await Orders.find()
        let users = orders.map(a => {
            return a.userId
        })
        console.log(users)
        users = await Userget(users)
        let products = orders.reduce((a, c) => {
            a = [...a, ...c.items]
            return a
        }, [])
        products = await productget(products)
        console.log(products)
        orders = orders.map(a => {
            let g = users.find(f => f.userId === a.users)
            a.items = a.items.map(b => {
                let d = products.find(c => c._id === b)
                return d
            })
            return {

                cusmterorderList: a,
                cusmtername: g.name

            }

        })
        res.json({
            status: 200,
            data: orders
        })
    }
    catch (error) {
        console.log(error)
        res.status(400).json({
            message: error.message
        })
    }
}
module.exports = { orderplace, updateOrder, deleteOrder, listorder, date }