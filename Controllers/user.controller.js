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
	if (req.method == "POST") {
		// Hash password
		const encryptedPassword = await bcrypt.hash(
			req.body.password,
			parseInt(process.env.SALT_ROUNDS)
		);
		//data from front end
		const email = req.body.email;
		const first_name = req.body.first_name;
		const last_name = req.body.last_name;

		db.query(
			"SELECT * FROM users WHERE email = ? limit 1",
			[email],
			(err, user) => {
				if (err) {
					console.log(err);
				} else if (user.length > 0) {
					return res.send("this email already exists");
				} else if (user.length === 0) {
					if (email !== "" && req.body.password !== "") {
						db.query(
							"INSERT INTO users (email, first_name, last_name, password, role, activated) VALUES (?, ?, ?, ?, ?, ?)",
							[email, first_name, last_name, encryptedPassword, 1, false],
							(err, result) => {
								if (err) {
									console.log(err);
								} else {
									const user_id = result.insertId;
									const token = jwt.sign(
										{email: req.body.email, id: user_id},
										process.env.VERIFICATION_TOKEN
									);
									db.query(
										"INSERT INTO verification_token (user_id, token) VALUES (?, ?)",
										[user_id, token],
										(err) => {
											if (err) {
												console.log(err);
											}
										}
									);
									res
										.status(200)
										.send("Signed up successfully. Please check your email");
									emailingService.sendConfirmationEmail(
										first_name,
										email,
										token
									);
								}
							}
						);
					}
				} else {
					console.log("idk");
					return;
				}
			})
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

// TODO: REWRITE login without local passport
const userLogin = (req, res, next) => {
	passport.authenticate("local", (err, user) => {
		if (err) res.status(500).json({message: err});
		if (!user) {
			return res.status(400).send("Current password does not match");
		} else {
			req.logIn(user, {session: false}, (err) => {
				if (err) throw err;
				const userObject = {
					id: user.id,
					email: user.email,
					first_name: user.first_name,
					last_name: user.last_name,
				};
				const token = jwt.sign(
					userObject,
					process.env.LOGIN_SECRET_TOKEN || "someSecretToLogin"
				);
				res
					.cookie("access_token", token, {
						httpOnly: true,
						secure: process.env.NODE_ENV === "production",
					})
					.status(200)
					.json({
						user: {
							emai: user.email,
							first_name: user.first_name,
							last_name: user.last_name,
						},
						message: "Logged in successfully",
					});
			});
		}
	})(req, res, next);
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
