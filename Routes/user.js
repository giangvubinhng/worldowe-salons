const express = require("express");
const router = express.Router();
const userController = require('../Controllers/user.controller')

/**
 * User sign Up
 */
router.post("/signup", userController.userRegister);

/**
 * Verify user after registration using email service
 */
router.get("/user/verify/:token", userController.verifyUser);

/**
 * User sign in
 */
router.post("/login", userController.userLogin);

/**
 * getCurrentUser
 */
router.get("/current-user", userController.getCurrentUser);

/**
 * User logout
 */
router.get("/logout", userController.userLogout);

module.exports = router;
