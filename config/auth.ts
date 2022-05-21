//const jwt = require('jsonwebtoken');
import jwt from "jsonwebtoken"
//const db = require('../Models/database')
import db from '../Models/database'
import {Request, Response, NextFunction} from 'express'
import dotenv from 'dotenv'
dotenv.config();

/**
	* This function authenticate user before accessing any graphql API
	*/
const authenticate_graphQL = async (req: Request) => {
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
const authUser = async (req: Request, res: Response, next: NextFunction) => {
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
const verifyToken = (token: string, secret: string) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, secret, function (err: any, decoded: any) {
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

export {
	authUser,
	authenticate_graphQL
}
