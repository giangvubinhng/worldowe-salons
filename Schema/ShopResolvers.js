const shop = require("../services/shop.service");
const {ForbiddenError} = require("apollo-server-express");
const shopResolvers = {
	Query: {
		async bookings(_, args, context){
			try{
				const result = await shop.getBooking();
				if(result && result.success){
					return result.bookings
				}
			} catch(e){
				return e;
			}
		},
		async shops() {
			try {
				const result = await shop.getAllShops();
				if (result && result.success) {
					return result.shops
				}

			} catch (e) {
				return e;
			}
		},
		//Need to be worked on
		async myShops(_, args, context) {
			if (!context.user) {
				throw new ForbiddenError("Unauthorized");
			}
			try {
				const result = await shop.getMyShops(context.user.id);
				if (result && result.success) {
					return result.shops;
				}
			} catch (e) {
				return e
			}
		},

		async shop(_, args) {
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
		async createBooking(_, args, context){
			if (!context.user) {
				throw new ForbiddenError("Unauthorized");
			}
			try {
				const result = await shop.createBooking(args.booking, args.shop_id);
				if (result && result.success) {
					return result
				}
			} catch (e) {
				return e;
			}
		},
		async createShop(_, args, context) {
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

		async addServices(_, args, context) {
			if (!context.user) {
				throw new ForbiddenError("Unauthorized");
			}
			try {
				const result = await shop.addServices(context.user.id, args.shop_id, args.services)
				if (result && result.success) {
					return result
				}
			} catch (e) {
				return e
			}
		},

		async addTechnicians(_, args, context) {
			if (!context.user) {
				throw new ForbiddenError("Unauthorized");
			}
			try {
				const result = await shop.addTechnicians(context.user.id, args.shop_id, args.techs)
				if (result && result.success) {
					return result
				}
			} catch (e) {
				return e
			}
		},
	},
};

module.exports = {shopResolvers};
