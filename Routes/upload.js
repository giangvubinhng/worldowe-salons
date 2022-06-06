const router = require("express").Router();
const userMiddleware = require("../config/auth")
const uploadController = require('../Controllers/upload.controller')


/**
	* Upload profile picture
	*/
router.post("/profile", userMiddleware.authUser, uploadController.uploadProfilePicture)

/**
	* Retrieve profile picture
	*/
router.get("/profile", uploadController.retrieveProfilePicture)

module.exports = router;

