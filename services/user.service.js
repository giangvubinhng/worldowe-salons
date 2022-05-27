const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const db = require("../Models/database");
const emailingService = require("./emailing.service.js");
const {promises} = require("nodemailer/lib/xoauth2");
require("dotenv").config();
require("../config/passport")(passport);


const findByEmail = 'SELECT * FROM users WHERE email = ?';
// Functions start here
const userRegister = (body) => {
	return new Promise(async (resolve, reject) => {
		// Hash password
		const encryptedPassword = await bcrypt.hash(
			body.password,
			parseInt(process.env.SALT_ROUNDS)
		);
		//data from front end
		const email = body.email;
		const first_name = body.first_name;
		const last_name = body.last_name;

		db.query(
			findByEmail,
			[email],
			(err, user) => {
				if (err) {
					return reject({success: false, message: err})
				} else if (user.length > 0) {
					return reject({success: false, message: "This email already exists"});
				} else if (user.length === 0) {
					if (email !== "" && body.password !== "") {
						db.query(
							"INSERT INTO users (email, first_name, last_name, password, role, activated) VALUES (?, ?, ?, ?, ?, ?)",
							[email, first_name, last_name, encryptedPassword, 1, false],
							(err, result) => {
								if (err) {
									return reject({success: false, message: err})
								} else {
									const user_id = result.insertId;
									const token = jwt.sign(
										{email: body.email, id: user_id},
										process.env.VERIFICATION_TOKEN
									);
									db.query(
										"INSERT INTO verification_token (user_id, token) VALUES (?, ?)",
										[user_id, token],
										(err) => {
											if (err) {
												return reject({success: false, message: err})
											}
										}
									);
									emailingService.sendConfirmationEmail(
										first_name,
										email,
										token
									);
									return resolve({success: true, message: "Registered successfully. Please check your email"})
								}
							}
						);
					}
				}
			})

	})
}

const userLogin = (email, password) => {
	return new Promise((resolve, reject) => {
		db.query(findByEmail, [email], async (err, user) => {
			if (err) return reject({success: false, message: err})
			if (user.length < 1) {
				return reject({success: false, message: "Incorrect username or password"})
			}
			const correctPassword = await bcrypt.compare(password, user[0].password);
			if (!correctPassword) {
				return reject({success: false, message: "Incorrect username or password"})
			}
			if (user[0].activated == 0) {
				return reject({success: false, message: "Please verify your email address"})
			}
			const token = jwt.sign(
				{id: user[0].id, email: user[0].email, first_name: user[0].first_name, last_name: user[0].last_name},
				process.env.LOGIN_SECRET_TOKEN || "someSecretToLogin"
			);
			return resolve({success: true, message: "Logged in successfully", user: user[0], token})
		})

	})
}

const getCurrentUser = (token) => {
	const secret = process.env.LOGIN_SECRET_TOKEN || "someSecretToLogin";
	return new Promise((resolve, reject) => {
		jwt.verify(token, secret, (err, decoded) => {
			if (err || !decoded)
				return resolve({
					email: "",
					first_name: "",
					last_name: "",
					user_id: '',
					is_loggedIn: false,
				});
			const currentUser = {
				email: decoded.email,
				first_name: decoded.first_name,
				last_name: decoded.last_name,
				user_id: decoded.id,
				is_loggedIn: true,
			};
			return resolve(currentUser);
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
					return reject(err)
				} else {
					if (token.length > 0 && token[0].user_id) {
						db.query(
							"UPDATE users SET activated = true WHERE id = ?",
							[token[0].user_id],
							(err) => {
								if (err) {
									return reject(err)
								} else {
									db.query(
										"DELETE FROM verification_token WHERE user_id = ?",
										[token[0].user_id],
										(err) => {
											if (err) {
												return reject(err)
											}
										}
									);
									return resolve({success: true, message: "Verified successfully"})
								}
							}
						);
					} else {
						return reject({success: true, message: "User can't be verified"})
					}
				}
			}
		)
	})
}

const resetPassword = (token, password) => {
	const secret = process.env.RESET_PASSWORD_TOKEN || "someSecretToLogin";
	return new Promise((resolve, reject) => {
		jwt.verify(token, secret, (err, decoded) => {
			if (err || !decoded)
				return reject({success: false, message: "failed decoded"});
			db.query('SELECT * FROM verification_email WHERE email = "' + decoded.email + '"',
				async (err, user) => {
					if (err) {
						return reject({success: false, message: err});
					}
					else if (user.length > 0) {
						const encryptedPassword = await bcrypt.hash(
							password,
							parseInt(process.env.SALT_ROUNDS)
						);
						var data = {password: encryptedPassword};
						db.query('UPDATE users SET ? WHERE email ="' + decoded.email + '"', data, (err, result) => {
							if (err) {
								return reject({success: false, message: err});
							}
							else {
								db.query(
									"DELETE FROM verification_email WHERE email = ?", decoded.email,
									(err) => {
										if (err) {
											return reject(err);
										}
									}
								);
								return resolve({success: true, message: "Reset successfully"})
							}
						})
					}
				})
		})
	});
}

const resetPasswordWithEmail = (email) => {
	return new Promise((resolve, reject) => {
		const token = jwt.sign(
			{email: email},
			process.env.RESET_PASSWORD_TOKEN
		);
		db.query("INSERT INTO verification_email (email, token) VALUES (?, ?)",
			[email, token],
			(err) => {
				if (err) {
					return reject({success: false, message: err});
				}
			}
		);
		emailingService.sendResetPasswordEmail(
			token,
			email
		);
		return resolve({success: true, message: "email sent"});
	});
}

const changePassword = (token, oldPassword, newPassword) => {
	const secret = process.env.LOGIN_SECRET_TOKEN || "someSecretToLogin";
	return new Promise((resolve, reject) => {
		jwt.verify(token, secret, (err, decoded) => {
			if (err || !decoded) {
				return reject({success: false, message: "have not login yet"});
			}
			const email = decoded.email;
			db.query(findByEmail, [email], async (err, user) => {
				if (err) return reject({success: false, message: err});
				if (user.length < 1) {
					return reject({success: false, message: 'Cannot find user'});
				}
				const oldEncryptedPassword = await bcrypt.hash(
					oldPassword,
					parseInt(process.env.SALT_ROUNDS)
				);
				if (oldEncryptedPassword !== user[0].password) {
					return reject({success: false, message: 'Your current password does not match the password you submitted'});
				}
				const encryptedPassword = await bcrypt.hash(
					newPassword,
					parseInt(process.env.SALT_ROUNDS)
				);
				var data = {password: encryptedPassword};
				db.query('UPDATE users SET ? WHERE email ="' + email + '"', data, (err, result) => {
					if (err) {
						return reject({success: false, message: err});
					}
					else {
						return resolve({success: true, message: "Change Password successfully"});
					}
				})
			})
		});
	});
}

module.exports = {
	userRegister,
	userLogin,
	getCurrentUser,
	verifyUser,
	resetPassword,
	resetPasswordWithEmail,
	changePassword,
}
