const db = require('../Models/database');

/**
 * Get All salon
 */
exports.getAllShops = () => {
	const getAllQuery = 'SELECT * FROM location';
	return new Promise((resolve, reject) => {
		db.query(getAllQuery, (err, shops) => {
			if (err) reject(err);
			resolve(shops);
		});
	});
};

/**
 * Create a new salon
 */
exports.createNewShop = (args) => {
	return new Promise((resolve, reject) => {
		// Declare variables here	
		const phone = args.phone;
		const shop_name = args.shop_name;
		const shop_street = args.shop_street;
		const shop_city = args.shop_city;
		const shop_state = args.shop_state;
		const shop_country = args.shop_country;
		const technicians = args.technicians;
		const shop_zip = args.shop_zip;
		const services = args.services;
		// get currentUser_id
		const user_id = args.user.id;
		//add location
		db.query(
			'INSERT IGNORE INTO location (user_id, shop_name, street, city, state, country, zip, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
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
					reject(err);
				} else {
					console.log('added to location successfully');
				}
			}
		);
		// Technician of store
		technicians.forEach((tech) => {
			db.query(
				'INSERT INTO technicians (technician_name, store_id) VALUES (?, ?)',
				[tech, user_id],
				(err, rows) => {
					if (err) {
						console.log(err);
						reject(err);
					} else {
						console.log('added to technician successfully');
					}
				}
			);
		});
		// Services for store
		services.forEach((service) => {
			db.query(
				'INSERT IGNORE INTO services (store_id, service_name) VALUES (?, ?)',
				[user_id, service],
				(err, rows) => {
					if (err) {
						console.log(err);
						reject(err);
					} else {
						console.log('added to service successfully');
					}
				}
			);
		});
		resolve(args);
	});
};
