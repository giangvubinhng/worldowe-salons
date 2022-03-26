const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const db = require("../Models/database");
const emailingService = require("../services/emailing.service.js");
const userService = require("../services/user.service")
require("dotenv").config();
require("../config/passport")(passport);

/**
	* User register
	*/
const userRegister = async (req, res) => {
	try {
		const result = await userService.userRegister(req.body)
		if (result && result.success) {
			res.status(200).json(result)
		}
	} catch (e) {
		res.status(400).json(e)
	}
}

/**
 * Verify user after registration using email service
 */
const verifyUser = async (req, res) => {
	try {
		const result = await userService.verifyUser(req.params.token);
		if (result && result.success) {
			res.status(200).json(result)
		}
	} catch (e) {
		res.status(400).json(e);
	}

}

const userLogin = async (req, res, next) => {
	try {
		const result = await userService.userLogin(req.body.email, req.body.password)
		if (result && result.success) {
			res
				.cookie("access_token", result.token, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
				})
				.status(200)
				.json({
					user: {
						emai: result.user.email,
						first_name: result.user.first_name,
						last_name: result.user.last_name,
					},
					message: "Logged in successfully",
				});

		}

	}
	catch (e) {
		res.status(400).json(e)

	}
}
const getCurrentUser = async (req, res) => {
	if (!req || !req.cookies) {
		res.json({
			email: "",
			first_name: "",
			last_name: "",
			is_loggedIn: false,
		});
	}
	else {
		const token = req.cookies.access_token;
		const currentUser = await userService.getCurrentUser(token);
		res.json(currentUser)
	}
}

const userLogout = (req, res) => {
	if (req.cookies.access_token) {
		res.clearCookie("access_token").status(200).json({
			message: "You have logged out",
		});
	} else {
		res.status(401).json({
			error: "Invalid access_token",
		});
	}
}


module.exports = {
	userRegister,
	userLogin,
	verifyUser,
	getCurrentUser,
	userLogout
}
