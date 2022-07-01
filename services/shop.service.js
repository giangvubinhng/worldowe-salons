const db = require("../Models/database");

/**
 * Get All salon
 */
const getAllShops = (name) => {
	let getAllQuery = ''
	if (name === '' || name === undefined) {
		getAllQuery = "SELECT * FROM location";

	}
	else {
		getAllQuery = 'SELECT * FROM location WHERE shop_name LIKE ' + db.escape(`%${name}%`)
	}
	return new Promise((resolve, reject) => {
		db.query(getAllQuery, (err, shops) => {
			if (err) {
				return reject({success: false, message: err});
			}
			return resolve({success: true, message: "Retrieved all shops successfully", shops: shops});
		});
	});
};

/*
 * Get this salon
 */
const getShop = (id) => {
	const getShopQuery = "SELECT * FROM location WHERE id=?";
	return new Promise((resolve, reject) => {
		db.query(getShopQuery, [id], (err, result) => {
			if (err) return reject({success: false, message: err});
			return resolve({success: true, message: "Retrieve one shop successfully", shop: result[0]});
		});
	});
};

/**
 * Create a new salon
 */
const createNewShop = (user_id, shop) => {
	return new Promise((resolve, reject) => {
		// Declare variables here
		const phone = shop.phone;
		const shop_name = shop.shop_name;
		const shop_street = shop.street;
		const shop_city = shop.city;
		const shop_state = shop.state;
		const shop_country = shop.country;
		const shop_zip = shop.zip;
		//add location
		db.query(
			"INSERT IGNORE INTO location (user_id, shop_name, street, city, state, country, zip, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
			[
				user_id,
				shop_name,
				shop_street,
				shop_city,
				shop_state,
				shop_country,
				shop_zip,
				phone,
			],
			(err, rows) => {
				if (err) {
					return reject({success: false, message: err});
				} else {
					return resolve({success: true, message: "Shop created successfully", shop: shop});
				}
			}
		);
	});
};

/*
 * Add technicians for shop
 */
const addTechnicians = (user_id, shop_id, techs) => {
	return new Promise(async (resolve, reject) => {
		try {
			const result = await isShopOwner(user_id, shop_id)
			if (!result.success) {
				return reject({success: false, message: "No permission"});
			}
			techs.forEach((tech) => {
				db.query(
					"INSERT INTO technicians (shop_id, technician_name) VALUES (?, ?)",
					[shop_id, tech],
					(err) => {
						if (err) {
							return reject({success: false, message: err});
						}
					}
				);
			});
			return resolve({success: true, message: "Added Technician(s) successfully", technicians: techs});
		} catch (e) {
			return reject({success: false, message: e});
		}
	});
};
/*
 * Add services for shop
 */
const addServices = (user_id, shop_id, services) => {
	return new Promise(async (resolve, reject) => {
		try {
			const result = await isShopOwner(user_id, shop_id)
			if (!result.success) {
				return reject({success: false, message: "No permission"});
			}
			services.forEach((service) => {
				db.query(
					"INSERT IGNORE INTO services (shop_id, service_name) VALUES (?, ?)",
					[shop_id, service],
					(err) => {
						if (err) {
							return reject({success: false, message: err});
						}
					}
				);
			});
			return resolve({success: true, message: "Added Service(s) successfully", services: services});
		} catch (e) {
			return reject({success: false, message: e});
		}
	});
};

const getMyShops = (user_id) => {
	const getShopQuery = "SELECT * FROM location WHERE user_id=?";
	return new Promise((resolve, reject) => {
		db.query(getShopQuery, [user_id], (err, result) => {
			if (err) return reject({success: false, message: err});
			return resolve({success: true, message: "Retrieve shops successfully", shops: result});
		});
	});
}

/*
	* Helper functions
	* @return {success, shop}
	*/
async function isShopOwner(user_id, shop_id) {
	const getShopQuery = "SELECT * FROM location WHERE user_id=? AND id=?";
	return new Promise((resolve, reject) => {
		db.query(getShopQuery, [user_id, shop_id], (err, result) => {
			if (err) return reject({success: false, message: err});
			if (result.length == 0) {
				return reject({success: false, message: "You can't perform action on shop"});
			}
			return resolve({success: true, message: "Shop exists", shops: result[0]});
		});
	});
}


module.exports = {
	addServices,
	getAllShops,
	getShop,
	addTechnicians,
	createNewShop,
	getMyShops
}
