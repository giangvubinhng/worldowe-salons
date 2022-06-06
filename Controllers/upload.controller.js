const uploadService = require("../services/upload.service")

/**
	* Upload profile picture
	*/
const uploadProfilePicture = async (req, res) => {
	try {
		if (req.user) {

			if (!req.files || Object.keys(req.files).length === 0) {
				res.status(400).send('No files were uploaded')
			}

			const result = await uploadService.uploadProfilePicture(req.files.profile, req.user)

			if (result && result.success) {
				res.status(200).json(result)
			}

		}
	} catch (e) {
		res.status(400).json(e)
	}
}


module.exports = {
	uploadProfilePicture,
}
