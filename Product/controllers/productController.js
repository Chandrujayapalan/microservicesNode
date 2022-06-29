const Products = require('../model/productModel')
const excelToJson = require('convert-excel-to-json')
const uploadproduct = async (req, res, next) => {
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
        result = await Products.insertMany(result.Sheet1)
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
const product = async (req, res, next) => {
    try {
        let products = await Products.find({ _id: {$in  : req.body.ids} })
        res.json({
            status: 200,
            data: products
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: error.message
        })
    }
}
    module.exports = { uploadproduct, product }