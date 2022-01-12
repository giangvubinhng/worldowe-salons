const jwt = require('jsonwebtoken');
const db = require('../Models/database')
require('dotenv').config();


// change to process.env.LOGIN_SECRET_TOKEN
const secret = process.env.Login || 'someSecretToLogin';
const findByEmail = 'SELECT * FROM users WHERE email = ?'

module.exports.authUser = (req) => {
				var token = null;
				var user = null
				if (req && req.cookies){
						token = req.cookies.access_token;
				}	
				jwt.verify(token, secret, function(err, decoded){
					if(err)	return null
						if(!decoded) null
					db.query(findByEmail, [decoded.email], (err, users) => {
						if(err) return null
							if(!user) return null

							user = users[0];
					})	
						
				}) 
		return user
}
