const db = require("../Models/database");

/**
 * Get All salon
 */
const getAllShops = () => {
	const getAllQuery = "SELECT * FROM location";
	return new Promise((resolve, reject) => {
		db.query(getAllQuery, (err, shops) => {
			if (err) return reject({success: false, message: err});
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
			return resolve({success: true, message: "Retrieve one shop successfully", shop: result[1]});
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
const addTechnicians = (techs) => {
	return new Promise((resolve, reject) => {
		// hard code
		const store_id = 1;
		techs.forEach((tech) => {
			db.query(
				"INSERT INTO technicians (store_id, technician_name) VALUES (?, ?)",
				[store_id, tech],
				(err, rows) => {
					if (err) {
						return reject({success: false, message: err});
					} else {
					}
				}
			);
		});
		return resolve({success: true, message: "Added Technician(s) successfully", technicians: techs});
	});
};
/*
 * Add services for shop
 */
const addServices = (services) => {
	return new Promise((resolve, reject) => {
		// hard code
		const shop_id = 1;
		services.forEach((service) => {
			db.query(
				"INSERT IGNORE INTO services (shop_id, service_name) VALUES (?, ?)",
				[shop_id, service],
				(err, rows) => {
					if (err) {
						return reject({success: false, message: err});
					} else {
					}
				}
			);
		});
		return resolve({success: true, message: "Added Service(s) successfully", services: services});
	});
};

module.exports = {
	addServices,
	getAllShops,
	getShop,
	addTechnicians,
	createNewShop
}
