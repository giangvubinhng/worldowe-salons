const jwt = require('jsonwebtoken');
const db = require('../Models/database')
require('dotenv').config();


module.exports.authUser = async (req) => {
				let token = null;
				let user = null
				const secret = process.env.LOGIN_SECRET_TOKEN || 'someSecretToLogin';
				if (req && req.cookies && req.cookies.access_token){
					token = req.cookies.access_token;
					jwt.verify(token, secret, function(err, decoded){
					if(err){
						return null
					}
					if(!decoded)
					{
						return null
					}
					else{
						user = decoded;
					}	
				}) 
					return user
				}	
				return null

}

module.exports.authAndFindUser = async (req) => {
	return new Promise((resolve, reject) => { 
				let token = null;
				const secret = process.env.LOGIN_SECRET_TOKEN || 'someSecretToLogin';
				const findByEmail = 'SELECT * FROM users WHERE email = ?'
				if (req && req.cookies && req.cookies?.access_token){
					token = req.cookies.access_token;
					jwt.verify(token, secret, function(err, decoded){
					if(err){
						console.log(err)
						reject(err)
					}
						if(!decoded)
					{
						console.log("nothing found");
						reject(null)
					}
					db.query(findByEmail, [decoded.email], (err, users) => {
						if(err) return reject(err)
						if(!users) return reject(null);
						return resolve(users[0]);
							
					})	
						
				}) 
				}	
				return reject(null);
	})
}

