import express from 'express'
const router = express.Router();
const userMiddleware = require('../config/auth');
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
router.post("/reset-password/:token", userController.userReset);

/**
 * reset password with send to email
 */

router.post("/send-reset-password-email", userController.resetPasswordWithEmail);

/**
 * create change password
 */
router.post("/change-password", userMiddleware.authUser, userController.changePassword);

module.exports = router;
