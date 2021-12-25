const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local');
const db = require('../Models/database');
const emailingService = require('../services/emailing.service.js');
require('dotenv').config();

/**
 * User sign Up
 */
exports.signup = async function (req, res) {
	if (req.method == 'POST') {
		// Hash password
		const encryptedPassword = await bcrypt.hash(
			req.body.password,
			parseInt(process.env.SALT_ROUNDS)
		);
		//data from front end
		const email = req.body.email;
		const shop_name = req.body.shop_name;
		const phone = req.body.phone;
		const shop_street = req.body.shop_street;
		const shop_city = req.body.shop_city;
		const shop_state = req.body.shop_state;
		const shop_country = req.body.shop_state;
		const shop_zip = req.body.shop_zip;
		const technicians = req.body.technicians;
		const services = req.body.services;

		db.query(
			'SELECT * FROM users WHERE email = ? limit 1',
			[email],
			(err, user) => {
				if (err) {
					console.log(err);
				} else if (user.length > 0) {
					return res.send('this email already exists');
				} else if (user.length === 0) {
					if (email !== '' && req.body.password !== '') {
						db.query(
							'INSERT INTO users (email, password, shop_name, phone, activated) VALUES (?, ?, ?, ?, ?)',
							[email, encryptedPassword, shop_name, phone, false],
							(err, result) => {
								if (err) {
									console.log(err);
								} else {
									const user_id = result.insertId;
									// Store location
									db.query(
										'INSERT INTO location (user_id, street, city, state, country, zip) VALUES (?, ?, ?, ?, ?, ?)',
										[
											user_id,
											shop_street,
											shop_city,
											shop_state,
											shop_country,
											shop_zip,
										],
										(err, rows) => {
											if (err) {
												console.log(err);
											} else {
												console.log('added to location successfully');
											}
										}
									);
									// Technician of store
									technicians.forEach((tech) => {
										db.query(
											'INSERT INTO technicians (technician_name, user_id) VALUES (?, ?)',
											[tech.name, user_id],
											(err, rows) => {
												if (err) {
													console.log(err);
												} else {
													console.log('added to technician successfully');
												}
											}
										);
									});
									// Services for store
									services.forEach((service) => {
										db.query(
											'INSERT INTO services (user_id, service_name) VALUES (?, ?)',
											[user_id, service.name],
											(err, rows) => {
												if (err) {
													console.log(err);
												} else {
													console.log('added to technician successfully');
												}
											}
										);
									});
									const token = jwt.sign(
										{ email: req.body.email, id: user_id },
										process.env.VERIFICATION_TOKEN
									);
									db.query(
										'INSERT INTO verification_token (user_id, token) VALUES (?, ?)',
										[user_id, token],
										(err) => {
											if (err) {
												console.log(err);
											}
										}
									);
									res
										.status(200)
										.send('Signed up successfully. Please check your email');
									emailingService.sendConfirmationEmail(
										shop_name,
										email,
										token
									);
								}
							}
						);
					}
				} else {
					console.log('idk');
					return;
				}
			}
		);
	}
};

/**
 * Verify user after registration using email service
 */
exports.verifyUser = async (req, res) => {
	db.query(
		'SELECT user_id FROM verification_token WHERE token = ? limit 1',
		[req.params.token],
		(err, token) => {
			if (err) {
				console.log(err);
			} else {
				if (token && token[0].user_id) {
					db.query(
						'UPDATE users SET activated = true WHERE id = ?',
						[token[0].user_id],
						(err) => {
							if (err) {
								console.log(err);
							} else {
								db.query(
									'DELETE FROM verification_token WHERE user_id = ?',
									[token[0].user_id],
									(err) => {
										if (err) {
											console.log(err);
										}
									}
								);
								return res.status(200).send('Verified successfully!');
							}
						}
					);
				} else {
					return res.status(400).send('Invalid Token');
				}
			}
		}
	);
};

/**
 * Sign in logic
 */
exports.signin = async (req,res) => {
		passport.use(new LocalStrategy({
						usernameField: 'email',
						passwordField: 'password',
						session: false
				},
				function verify(username, password, done)
				{
						db.query('SELECT * FROM users WHERE email = ?', [username], async (err, user) => {
								if(err) { return done(err);}
								if(!user) {
										return done(null, false, {message: 'Incorrect username or password.'});
								}
								const correctPass = await bcrypt.compare(password, user[0].password);
								if(!correctPass)
								{
										return res.status(400).json({
												message: "Incorrect username or password."
										})
								}
								return res.status(200).json({
										message: "Login successfully"
								})
						});
				}));
}


