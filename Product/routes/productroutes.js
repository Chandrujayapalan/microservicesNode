const express = require('express')
const router = express.Router()
const upload =  require('../middleware/upload')
const authenticate  = require('../middleware/authendicate')
const controllers = require('../controllers/productController')
router.post('/upload/product',authenticate.authenticating,authenticate.admin,upload.single('file'),controllers.uploadproduct)
// router.get('/listproduct',authenticate.authenticating,controllers.listproduct)
router.post('/list/product',controllers.product)
module.exports =router  