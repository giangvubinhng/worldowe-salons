const bcrypt = require('bcrypt');
const db = require('../Models/database');
/**
 * User sign Up
 */
var message = '';
exports.signup = function async(req, res) {
	message = '';
	if (req.method == 'POST') {
		const encryptedPassword = await bcrypt.hash(
			req.body.password,
			process.env.SALT_ROUNDS
		);
		const email = req.body.email;
		const shop_name = req.body.shop_name;
		const phone = req.body.phone;
		db.query('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
			if (err) {
				console.log(err);
				return;
			} else if (user.length > 0) {
				console.log('this email already exists');
				return;
			} else if ((user.length = 0)) {
				if (email !== '' && password !== '') {
					db.query(
						'INSERT INTO user (email, password, shop_name, phone) VALUES (?, ?, ?, ?)',
						[email, encryptedPassword, shop_name, phone],
						(err, rows) => {
							if (err) {
								console.log(err);
								return;
							} else {
								res.status(200).send('Signed up successfully');
							}
						}
					);
				}
			}
		});
	}
};
