const db = require("../Models/database");

const statement = {
	findById: 'SELECT * FROM bookings WHERE id = ?',
	getBookingsOfShop: 'SELECT * FROM bookings WHERE shop_id = ?',
	createBooking: "INSERT INTO bookings (shop_id, phone, customer_name, booking_created, booking_start, booking_end, preferred_tech) VALUES (?, ?, ?, ?, ?, ?, ?)",
	insertIntoBookedServices: "INSERT INTO booked_services (booking_id, service_name) VALUES (?, ?)",
	deleteBookingQuery: "DELETE FROM bookings WHERE id = ?"
}

const getBookingsByShopId = async (shop_id) => {
	return new Promose((resolve, reject) => {
		db.query(statement.getBookingsOfShop, [shop_id], (err, result) => {
			if (err) {
				return reject({success: false, message: err})
			}
			if (result.length === 0) {
				return reject({success: false, message: "no result found from id"})
			}
			return resolve({success: true, result: result, message: "bookings retrieved successfully"})
		})
	})
}

const getBooking = (id) => {
	return new Promise((resolve, reject) => {
		db.query(statement.findById, [id], (err, result) => {
			if (err) {
				return reject({success: false, message: err})
			}
			if (result.length === 0) {
				return reject({success: false, message: "no result found from id"})
			}
			return resolve({success: true, result: result[0], message: "booking retrieved successfully"})
		})
	})
}

const createBooking = async (body) => {
	return new Promise((resolve, reject) => {
		db.query(statement.createBooking, [body.shop_id, body.phone, body.customer_name, body.booking_created, body.booking_start, body.booking_end, body.preferred_tech], (err, result) => {

			if (err) {
				return reject({success: false, message: err})
			}
			const shop_id = result.insertId;
			body.services.forEach((s) => {
				db.query(statement.insertIntoBookedServices, [shop_id, s], (err) => {
					if (err) {
						return reject({success: false, message: err})
					}
					return resolve({success: true, message: "booking created successfully"})
				})
			})
		})
	})
}

const deleteBooking = async (booking_id) => {
	return new Promise((resolve, reject) => {
		db.query(statement.deleteBookingQuery, [booking_id], (err, result) => {
			if (err) {
				return reject({success: false, message: err})
			}
			return resolve({success: true, message: "Booking deleted successfully"})
		})
	})

}

module.exports = {getBookingsByShopId, getBooking, createBooking, deleteBooking}
