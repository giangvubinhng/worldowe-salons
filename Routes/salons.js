const db = require('../Models/database');


/**
 * Get All salon
 */
exports.getAllSalons = (req, res) => {
		const getAllQuery = "SELECT * FROM users"
		db.query(getAllQuery, (err, users) => {
				if(err) return res.status(500).json(err);
				if(!users) return res.json([]);
				let allUsers = users.map((user) => {
						return {
								email: user.email,
								shop_name: user.shop_name,
								phone: user.phone
						}
				})
				return res.json(allUsers)	
		})
}
