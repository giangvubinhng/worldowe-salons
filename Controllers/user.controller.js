const userService = require("../services/user.service")

/**
	* User register
	*/
const userRegister = async (req, res) => {
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
const verifyUser = async (req, res) => {
	try {
		const result = await userService.verifyUser(req.params.token);
		if (result && result.success) {
			res.status(200).json(result)
		}
	} catch (e) {
		res.status(400).json(e);
	}

}

const userLogin = async (req, res, next) => {
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
const getCurrentUser = async (req, res) => {
	if (!req.cookies) {
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
const getCurrentUserUsingReqBody = async (req, res) => {
	const token = req.body.access_token;
	const currentUser = await userService.getCurrentUser(token);
	return res.json(currentUser)
}

const userLogout = (req, res) => {
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

const userReset = async (req, res) => {
	try {
		const result = await userService.resetPassword(req.params.token, req.body.password);
		if (result && result.success) {
			res.status(200).json(result)
		}
	} catch (e) {
		res.status(400).json(e)
	}
}

const resetPasswordWithEmail = async (req, res) => {
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

const changePassword = async (req, res) => {
	try {
		if (req.user) {
			const result = await userService.changePassword(req.user, req.body.oldPassword, req.body.newPassword);
			if (result && result.success) {
				res.status(200).json(result);
			}
		}
		res.status(400).send({success: false, message: "No user found"})
	}
	catch (e) {
		res.status(400).send(e);
	}
}



module.exports = {
	userRegister,
	userLogin,
	verifyUser,
	getCurrentUser,
	getCurrentUserUsingReqBody,
	userLogout,
	userReset,
	resetPasswordWithEmail,
	changePassword,
}
