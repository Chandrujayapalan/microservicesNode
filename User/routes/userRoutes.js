const express = require('express')
const router = express.Router()

const controllers = require('../controllers/userController')


router.post('/register',controllers.register)
router.post('/login',controllers.login)
router.post('/userGet',controllers.userget)
router.get('/verify/:userId/:uniqueString',controllers.verifys)
router.get('/verifed',controllers.verifed)
module.exports =router  