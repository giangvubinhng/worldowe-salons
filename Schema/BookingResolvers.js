const bookingService = require("../services/shop.service");
const {ForbiddenError} = require("apollo-server-express");
const bookingResolvers = {
	Query: {
		async bookings(_, args, context) {
			try {
				const result = await shop.getAllShops(args.name);
				if (result && result.success) {
					return result.shops
				}

			} catch (e) {
				return e;
			}
		},

		async booking(_, args) {
			try {
				const result = await shop.getShop(args.id);
				if (result && result.success) {
					return result.shop
				}

			} catch (e) {
				return e
			}
		},
	},
	Mutation: {
		async createBooking(_, args, context) {
			if (!context.user) {
				throw new ForbiddenError("Unauthorized");
			}
			try {
				const result = await shop.createNewShop(context.user.id, args.shop);
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
