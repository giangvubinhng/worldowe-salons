const jwt = require('jsonwebtoken');
const db = require('../Models/database')
require('dotenv').config();


const authUser = async (req, res, next) => {
	const secret = process.env.LOGIN_SECRET_TOKEN || 'someSecretToLogin';
	if (req && req.cookies && req.cookies.access_token) {
		const token = req.cookies.access_token;
		try {
			const user = await verifyToken(token, secret)
			next();
		} catch (e) {
			res.status(403).json("Not Authorized")
			next(e);
		}
	}
	else{
		res.status(403).json("Not Authorized")
		
	}
	
}

const verifyToken = (token, secret) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, secret, function (err, decoded) {
			if (err) {
				return reject(err)
			}
			if (!decoded) {
				return reject(null)
			}
			else {
				return resolve(decoded)
			}
		})
	})
}

module.exports = {
	authUser,
}
