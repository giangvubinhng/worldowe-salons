const db = require('../Models/database');

/**
 * Get All salon
 */
exports.getAllSalons = (req, res) => {
	const getAllQuery = 'SELECT * FROM location';
	db.query(getAllQuery, (err, shops) => {
		if (err) return res.status(500).json(err);
		if (!shops) return res.json([]);	
		return res.json(shops);
	});
};
/**
 * Create a new salon
 */
exports.createNewSalon = (req, res, next) => {
	const phone = req.body.phone;
	const shop_name = req.body.shop_name;
	const shop_street = req.body.shop_street;
	const shop_city = req.body.shop_city;
	const shop_state = req.body.shop_state;
	const shop_country = req.body.shop_country;
	const technicians = req.body.technicians;
	const shop_zip = req.body.shop_zip;
	const services = req.body.services;
	// get currentUser_id
	const user_id = req.user.id;
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
				console.log(err);
			} else {
				console.log('added to location successfully');
			}
		}
	);
	// Technician of store
	technicians.forEach((tech) => {
		db.query(
			'INSERT INTO technicians (technician_name, store_id) VALUES (?, ?)',
			[tech.name, user_id],
			(err, rows) => {
				if (err) {
					console.log(err);
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
			[user_id, service.name],
			(err, rows) => {
				if (err) {
					console.log(err);
				} else {
					console.log('added to service successfully');
				}
			}
		);
	});
		return res.status(200).json({message: "Created shop successfully!"});
};
