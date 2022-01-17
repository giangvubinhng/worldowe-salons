const bcrypt = require('bcrypt');
const passport = require('passport');
const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../Models/database');
const emailingService = require('../services/emailing.service.js');
require('dotenv').config();
require('../config/passport')(passport);
/**
 * User sign Up
 */
router.post('/api/signup', async function (req, res) {
	if (req.method == 'POST') {
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
							'INSERT INTO users (email, first_name, last_name, password, role, activated) VALUES (?, ?, ?, ?, ?, ?)',
							[email, first_name, last_name, encryptedPassword, 1, false],
							(err, result) => {
								if (err) {
									console.log(err);
								} else {
									const user_id = result.insertId;
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
										first_name,
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
})


/**
 * Verify user after registration using email service
 */
router.get('/api/user/verify/:token', async (req, res) => {
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
})

/**
 * Sign in logic
 */
router.post('/api/login', (req, res, next) => {
	passport.authenticate('local', (err, user) => {
		if (err) res.status(500).json({message: err});
		if (!user){
				return res.status(400).send('Current password does not match')
		} 
		else {
			req.logIn(user, { session: false }, (err) => {
				if (err) throw err;
				const userObject = { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name };
				const token = jwt.sign(
					userObject,
					process.env.LOGIN_SECRET_TOKEN || 'someSecretToLogin'
				);
					res.cookie("access_token", token, {
							httpOnly: true,
							secure: process.env.NODE_ENV === "production",
					}).status(200).json({user:{emai: user.email, first_name: user.first_name, last_name: user.last_name }, message: "Logged in successfully"})
			});
		}
	})(req, res, next);
});


/**
 * getCurrentUser
 */
router.get('/api/current-user', (req, res) => {
		if(!req || !req.cookies){
				return res.json({email: '', first_name: '', last_name: '', is_loggedIn: false});
		}
		const token = req.cookies.access_token	
		const secret = process.env.LOGIN_SECRET_TOKEN || "someSecretToLogin"
		jwt.verify(token, secret, (err, decoded) => {
				if(err || !decoded) return res.json({email: '', first_name: '', last_name: '', is_loggedIn: false})
				const currentUser = {
						email: decoded.email,
						first_name: decoded.first_name,
						last_name: decoded.last_name,
						is_loggedIn: true
				}
				return res.json(currentUser)
		
		})


})

router.get('/api/logout', (req, res) => {
    if (req.cookies.access_token) {
        res
        .clearCookie('access_token')
        .status(200)
        .json({
            message: 'You have logged out'
        })
    } else {
        res.status(401).json({
            error: 'Invalid access_token'
        })
    }
})

module.exports = router
