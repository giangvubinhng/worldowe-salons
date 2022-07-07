const bookingService = require("../services/booking.service");
const {ForbiddenError} = require("apollo-server-express");
const bookingResolvers = {
	Query: {
		async bookings(_, args, context) {
			try {
				const result = await bookingService.getBookingsByShopId(args.shop_id);
				if (result && result.success) {
					return result.result
				}

			} catch (e) {
				return e;
			}
		},

		async booking(_, args) {
			try {
				const result = await bookingService.getBooking(args.id);
				if (result && result.success) {
					return result.result
				}

			} catch (e) {
				return e
			}
		},
	},
	Mutation: {
		async createBooking(_, args, context) {
			try {
				const result = await bookingService.createBooking(args.createBookingRequestBody);
				if (result && result.success) {
					return result
				}
			} catch (e) {
				return e;
			}
		},
		async deleteBooking(_, args, context) {
			if (!context.user) {
				throw new ForbiddenError("Unauthorized");
			}
			try {
				const result = await bookingService.deleteBooking(args.booking_id);
				if (result && result.success) {
					return result
				}
			} catch (e) {
				return e;
			}
		},
	},
};

module.exports = {bookingResolvers};
