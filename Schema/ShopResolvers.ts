const shop = require("../services/shop.service");
import {ForbiddenError} from "apollo-server-express";
const shopResolvers = {
	Query: {
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
		async myShops(_: any, args: any, context: any) {},

		async shop(_: any, args: any) {
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
		async createShop(_: any, args: any, context: any ) {
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
		addService(_: any, args: any, context: any) {
			if (!context.user) {
				throw new ForbiddenError("Unauthorized");
			}
		},
		//Need to be worked on
		addTechnician(_: any, args: any, context: any) {
			if (!context.user) {
				throw new ForbiddenError("Unauthorized");
			}
		},
	},
};

export {shopResolvers};
