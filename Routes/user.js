const express = require("express");
const router = express.Router();
const userController = require('../Controllers/user.controller')

/**
 * User sign Up
 */
router.post("/api/signup", userController.userRegister);

/**
 * Verify user after registration using email service
 */
router.get("/api/user/verify/:token", userController.verifyUser);

/**
 * User sign in
 */
router.post("/api/login", userController.userLogin);

/**
 * getCurrentUser
 */
router.get("/api/current-user", userController.getCurrentUser);

/**
 * User logout
 */
router.get("/api/logout", userController.userLogout);

module.exports = router;
