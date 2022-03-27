const shop = require("../services/shop.service");
const {ForbiddenError} = require("apollo-server-express");
const shopResolvers = {
	Query: {
		async shops() {
			try {
				const result = await shop.getAllShops();
				if (result && result.success) {
					return result
				}

			} catch (e) {
				return e;
			}
		},
		//Need to be worked on
		async myShops(_, args, context) {},
		//Need to be worked on
		async shop(_, args) {
			try {
				const result = await shop.getShop(args.id);
				if (result && result.success) {
					return result
				}

			} catch (e) {
				return e
			}
		},
	},
	Mutation: {
		async createShop(_, args, context) {
			if (!context.user) {
				throw new ForbiddenError("Unauthorized");
			}
			try {
				const result = shop.createNewShop(context.user.id, args.shop);
				if (result && result.success) {
					return result
				}
			} catch (e) {
				return e;
			}
		},
		//Need to be worked on
		addService(_, args, context) {
			if (!context.user) {
				throw new ForbiddenError("Unauthorized");
			}
		},
		//Need to be worked on
		addTechnician(_, args, context) {
			if (!context.user) {
				throw new ForbiddenError("Unauthorized");
			}
		},
	},
};

module.exports = {shopResolvers};
