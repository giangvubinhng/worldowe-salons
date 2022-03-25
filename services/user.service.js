const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const db = require("../Models/database");
const emailingService = require("../services/emailing.service.js");
require("dotenv").config();
require("../config/passport")(passport);


const getCurrentUser = (token) => {
	const secret = process.env.LOGIN_SECRET_TOKEN || "someSecretToLogin";
	return new Promise((resolve, reject) => {
		jwt.verify(token, secret, (err, decoded) => {
			if (err || !decoded)
				return resolve({
					email: "",
					first_name: "",
					last_name: "",
					is_loggedIn: false,
				});
			const currentUser = {
				email: decoded.email,
				first_name: decoded.first_name,
				last_name: decoded.last_name,
				is_loggedIn: true,
			};
			return res.resolve(currentUser);
		});
	})
}

const verifyUser = (token) => {
	return new Promise((resolve, reject) => {
		db.query(
			"SELECT user_id FROM verification_token WHERE token = ? limit 1",
			[token],
			(err, token) => {
				if (err) {
					console.log(err);
					return reject(err)
				} else {
					if (token && token[0].user_id) {
						db.query(
							"UPDATE users SET activated = true WHERE id = ?",
							[token[0].user_id],
							(err) => {
								if (err) {
									console.log(err);
									return reject(err)
								} else {
									db.query(
										"DELETE FROM verification_token WHERE user_id = ?",
										[token[0].user_id],
										(err) => {
											if (err) {
												console.log(err);
												return reject(err)
											}
										}
									);
									return resolve({success: true, message: "Verified successfully"})
									//return res.status(200).send("Verified successfully!");
								}
							}
						);
					} else {
						//return res.status(400).send("User can't be verified.");
						return reject({success: true, message: "User can't be verified"})
					}
				}
			}
		)
	})
}

module.exports = {
	getCurrentUser,
	verifyUser
}
