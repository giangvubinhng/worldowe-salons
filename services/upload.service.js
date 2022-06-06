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
			db.query("UPDATE users SET profile_image = ? WHERE id = ?", [file.name, id], (err, rows) => {
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

/*
	* Function to retrieve profile picture
	*/
const retrieveProfilePicture = (id) => {
	const findById = "SELECT * from users WHERE id = ?"
	return new Promise((resolve, reject) => {
		db.query(findById, [id], (err, users) => {
			if (err || (!users || users.length === 0)) {
				return reject({success: false, message: "Failed to retrieve profile picture"})
			}
			const profile_image = users[0].profile_image
			return resolve({success: true, message: "Profile picture retrieved", profile_image})
		})
	})

}

module.exports = {
	uploadProfilePicture,
	retrieveProfilePicture
}
