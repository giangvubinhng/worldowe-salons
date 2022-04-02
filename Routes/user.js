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
router.get("/verify/:token", userController.verifyUser);

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

/**
 * reset password base on token
 */
router.post("/resetpass/:token", userController.userReset);

/**
 * reset password with send to email
 */

router.post("/email-reset", userController.resetPasswordWithEmail);

module.exports = router;
