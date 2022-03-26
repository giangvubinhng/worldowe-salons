const jwt = require('jsonwebtoken');
const db = require('../Models/database')
require('dotenv').config();


const authUser = async (req) => {
	const secret = process.env.LOGIN_SECRET_TOKEN || 'someSecretToLogin';
	if (req && req.cookies && req.cookies.access_token) {
		const token = req.cookies.access_token;
		try {
			const user = await verifyToken(token, secret)
			return user;
		} catch (e) {
			return null;
		}
		return user
	}
	return null
}

const verifyToken = (token, secret) => {
	return new Promise(() => {
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
