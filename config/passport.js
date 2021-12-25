const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy
const db = require('../Models/database');



module.exports = function (passport) {
		const findByEmail = 'SELECT * FROM users WHERE email = ?'
		const findById = 'SELECT * FROM users WHERE id = ?'
		passport.use(new LocalStrategy({
						usernameField: 'email',
						passwordField: 'password',
						session: false
				},
				(username, password, done) =>
				{
						db.query(findByEmail, [username], async (err, user) => {
								if(err) { return done(err);}
								if(!user) {
										return done(null, false, {message: 'Incorrect username or password.'});
								}
								const correctPass = await bcrypt.compare(password, user[0].password);
								if(!correctPass)
								{
										return done(null, false,{
												message: "Incorrect username or password."
										})
								}
								return done(null, user, {
										message: "Login successfully"
								})
						});
				}));

		passport.serializeUser((user, cb) => {
				cb(null, user[0].id);
		});
		passport.deserializeUser((id, cb) => {
				db.query(findById, [id], (err, user) => {
						const userInfo = {
								email: user.email
						}
						console.log(id)
						cb(err, userInfo);
				})
		})
}

