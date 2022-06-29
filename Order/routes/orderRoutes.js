const express = require('express')
const router = express.Router()
const authenticate  = require('../middleware/authendicate')
const controller = require('../controllers/orderController')
router.post('/orderplace',authenticate.authenticating,controller.orderplace)
router.put('/updateorder',authenticate.authenticating,controller.updateOrder)
router.delete('/deleteOrder',authenticate.authenticating,controller.deleteOrder)
router.get('/listOrder',authenticate.authenticating,controller.listorder)
router.get('/date',authenticate.authenticating,controller.date)
module.exports =router  