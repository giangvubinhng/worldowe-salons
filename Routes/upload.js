const router = require("express").Router();
const userMiddleware = require("../config/auth")
const uploadController = require('../Controllers/upload.controller')


/**
	* Upload profile picture
	*/
router.post("/profile", userMiddleware.authUser, uploadController.uploadProfilePicture)

module.exports = router;

