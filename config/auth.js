const jwt = require('jsonwebtoken');
const db = require('../Models/database')
require('dotenv').config();



module.exports.authUser = async (req) => {
	return new Promise((resolve, reject) => { 
				var token = null;
				const secret = process.env.LOGIN_SECRET_TOKEN || 'someSecretToLogin';
				const findByEmail = 'SELECT * FROM users WHERE email = ?'
				if (req && req.cookies){
						token = req.cookies.access_token;
				}	
				jwt.verify(token, secret, function(err, decoded){
					if(err){
						return reject(err)
					}
						if(!decoded)
					{
						return reject(null)
					}
					db.query(findByEmail, [decoded.email], (err, users) => {
						if(err) return reject(err)
						if(!users) return reject(null);
						return resolve(users[0]);
							
					})	
						
				}) 
	})
}
