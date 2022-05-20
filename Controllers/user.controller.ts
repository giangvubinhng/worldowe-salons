const userService = require("../services/user.service")
import {Request, Response, NextFunction} from 'express'

/**
	* User register
	*/
const userRegister = async (req: Request, res: Response) => {
	try {
		const result = await userService.userRegister(req.body)
		if (result && result.success) {
			res.status(200).json(result)
		}
	} catch (e) {
		res.status(400).json(e)
	}
}

/**
 * Verify user after registration using email service
 */
const verifyUser = async (req: Request, res: Response) => {
	try {
		const result = await userService.verifyUser(req.params.token);
		if (result && result.success) {
			res.status(200).json(result)
		}
	} catch (e) {
		res.status(400).json(e);
	}

}

const userLogin = async (req: Request, res: Response) => {
	try {
		const result = await userService.userLogin(req.body.email, req.body.password)
		if (result && result.success) {
			res
				.cookie("access_token", result.token, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
				})
				.status(200)
				.json({
					user: {
						emai: result.user.email,
						first_name: result.user.first_name,
						last_name: result.user.last_name,
					},
					message: "Logged in successfully",
				});

		}

	}
	catch (e) {
		res.status(400).json(e)

	}
}
const getCurrentUser = async (req: Request, res: Response) => {
	if (!req || !req.cookies) {
		return res.json({
			email: "",
			first_name: "",
			last_name: "",
			is_loggedIn: false,
		});
	}
	else {
		const token = req.cookies.access_token;
		const currentUser = await userService.getCurrentUser(token);
		return res.json(currentUser)
	}
}

const userLogout = (req: Request, res: Response) => {
	if (req.cookies.access_token) {
		res.clearCookie("access_token").status(200).json({
			success: true,
			message: "You have logged out",
		});
	} else {
		res.status(401).json({
			success: false,
			message: "Invalid access_token",
		});
	}
}

const userReset = async (req: Request, res: Response) => {
	try {
		const result = await userService.resetPassword(req.params.token, req.body.password);
		if (result && result.success) {
			res.status(200).json(result)
		}
	} catch (e) {
		res.status(400).json(e)
	}
}

const resetPasswordWithEmail = async (req: Request, res: Response) => {
	try {
		const result = await userService.resetPasswordWithEmail(req.body.email);
		if (result && result.success) {
			res.status(200).json(result)
		}
	}
	catch (e) {
		res.status(400).json(e);
	}
}

const changePassword = async (req: Request, res: Response) => {
	try {
		if (req && req.cookies) {
			const result = await userService.changePassword(req.cookies.access_token, req.body.newPassword);
			if (result && result.success) {
				res.status(200).json(result);
			}
		}
	}
	catch (e) {
		res.status(400).json(e);
	}
}



module.exports = {
	userRegister,
	userLogin,
	verifyUser,
	getCurrentUser,
	userLogout,
	userReset,
	resetPasswordWithEmail,
	changePassword,
}
