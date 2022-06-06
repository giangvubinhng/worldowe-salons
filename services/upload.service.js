const db = require("../Models/database")

// CONSTANTS
const UPLOAD = '/app/uploads';
const PATHS = {
	PROFILE: `${UPLOAD}/profiles`,
}

/*
	* Function to upload profile picture
	*/
const uploadProfilePicture = (file, user) => {
	return new Promise((resolve, reject) => {

		file.mv(`${PATHS.PROFILE}/${file.name}`, (err) => {
			if (err) {
				return reject({success: false, message: "Internal error"})
			}
			const id = user.id;
			const IMAGE_PATH = `/uploads/profiles/${file.name}`
			db.query("UPDATE users SET profile_image = ? WHERE id = ?", [IMAGE_PATH, id], (err, rows) => {
				if (!err) {
					return resolve({success: true, message: "Profile picture uploaded"})
				}
				else {
					return reject({success: false, message: "Failed to upload profile picture"})
				}
			})

		})
	})
}

module.exports = {
	uploadProfilePicture,
}
