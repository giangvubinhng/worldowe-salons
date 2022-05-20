const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const db = require('../Models/database');
require('dotenv').config();

/**
* Helper method to get cookie sent with request
**/
const cookieExtractor = function (req) {
	var token = null;
	if (req && req.cookies){
			token = req.cookies.access_token;
	}
	return token;
};

module.exports = function (passport) {

	// Declare variables here	
	const findByEmail = 'SELECT * FROM users WHERE email = ?';
	var opts = {};
	opts.jwtFromRequest = cookieExtractor; // check token in cookie
	opts.secretOrKey = process.env.LOGIN_SECRET_TOKEN || 'someSecretToLogin';

	// passport local strategy	
	passport.use(
		new LocalStrategy(
			{
				usernameField: 'email',
				passwordField: 'password',
				session: false,
			},
			(username, password, done) => {
				db.query(findByEmail, [username], async (err, user) => {
					if (err) {
						return done(err);
					}
					if (user.length < 1) {
						return done(null, false, {
							message: 'Incorrect username or password.',
						});
					}
					const correctPass = await bcrypt.compare(password, user[0].password);
					if (!correctPass) {
						return done(null, false, {
							message: 'Incorrect username or password.',
						});
					}
					if (user[0].activated == 0)
						return done(null, false, { message: 'Please verify your email' });
					return done(null, user[0], {
						message: 'Login successfully',
					});
				});
			}
		)
	);

	// passport jwt strategy	
	passport.use(
		new JWTstrategy(opts, function (jwt_payload, done) {
			db.query(findByEmail, [jwt_payload.email], async (err, user) => {
				if (err) {
					return done(err, false);
				}
				if (user && user[0].activated === 1) {
					done(null, user[0]);
				} else {
					done(null, false);
				}
			});
		})
	);
};
