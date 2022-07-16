const express = require("express");
const userRoutes = express.Router();
const { uploadImage, termsImage, policyUpload, uploadCommonFiles, updatePersonalDetail,addFeedback,signUpUser,changePassword, loginUser, verifyEmail, waitlistUser, sendEmail, profile, terms, publicProfile, updateProfilePicture, updateUserQuickBio, blockUser, unBlockUser, reportUser,  resendCode,updatePassword } = require('../../middleware/user.validator')

const {
    userController, authController: { verifyAuth,verifyUserAuth,verifyInterServiceAuth }
} = require('../../controllers');
const { user } = require("../../constants");
const upload =  require('../../middleware/upload')
const authenticateds  = require('../../middleware/authendicate')

// Open Routes
userRoutes.post('/signup' ,signUpUser, userController.signup);
//Login Routes
userRoutes.post('/login', userController.login);
userRoutes.post('/upload',upload.single('file'),userController.uploadproducts)
userRoutes.post('/orderplace',authenticateds.authenticating,userController.orderplace)
userRoutes.put('/updateOrder',authenticateds.authenticating,userController.updateOrder)
userRoutes.delete('/deleteOrder',authenticateds.authenticating,userController.deleteOrder)
userRoutes.delete('/deleteBoolean',authenticateds.authenticating,userController.deleteBoolean)
userRoutes.get('/getOrder',authenticateds.authenticating,userController.getorder)
userRoutes.get('/listorder',authenticateds.authenticating,userController.listorder)
userRoutes.get('/userListOrder',authenticateds.authenticating,userController.userListOrder)
userRoutes.get('/listProduct',userController.listProduct)
userRoutes.get('/fileDownload',userController.fileDownload)
userRoutes.post('/sendVerificationEmail',userController.sendVerificationEmail)
module.exports = userRoutes;