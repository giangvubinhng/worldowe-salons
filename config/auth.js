const jwt = require('jsonwebtoken');
const db = require('../Models/database')
require('dotenv').config();

/**
	* This function authenticate user before accessing any graphql API
	*/
const authenticate_graphQL = async (req) => {
	const secret = process.env.LOGIN_SECRET_TOKEN || 'someSecretToLogin';
	if (req && req.cookies && req.cookies.access_token) {
		const token = req.cookies.access_token;
		try {
			const user = await verifyToken(token, secret)
			return user;
		} catch (e) {
			return null;
		}
	}
	return null
}
/**
	* This function is a middleware to authenticate user before accessing any REST API
	*/
const authUser = async (req, res, next) => {
	const secret = process.env.LOGIN_SECRET_TOKEN || 'someSecretToLogin';
	if (req && req.cookies && req.cookies.access_token) {
		const token = req.cookies.access_token;
		try {
			await verifyToken(token, secret)
			next();
		} catch (e) {
			res.status(403).json("Not Authorized")
		}
	}
	else {
		res.status(403).json("Not Authorized")
	}

}

/**
	* Helpfer function to verify jwt token
	*/
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
	authenticate_graphQL
}
