const bcrypt = require('bcrypt');
const db = require('../Models/database');
require('dotenv').config();
/**
 * User sign Up
 */
exports.signup = async function (req, res) {
	if (req.method == 'POST') {
		const encryptedPassword = await bcrypt.hash(
			req.body.password,
			parseInt(process.env.SALT_ROUNDS)
		);
		const email = req.body.email;
		const shop_name = req.body.shop_name;
		const phone = req.body.phone;
		db.query('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
			if (err) {
				console.log(err);
				return;
			} else if (user.length > 0) {
				return res.send('this email already exists');
			} else if (user.length === 0) {
				if (email !== '' && req.body.password !== '') {
					db.query(
						'INSERT INTO users (email, password, shop_name, phone) VALUES (?, ?, ?, ?)',
						[email, encryptedPassword, shop_name, phone],
						(err, rows) => {
							if (err) {
								console.log(err);
								return;
							} else {
								return res.status(200).send('Signed up successfully');
							}
						}
					);
				}
			} else {
				console.log('idk');
				return;
			}
		});
	}
};
