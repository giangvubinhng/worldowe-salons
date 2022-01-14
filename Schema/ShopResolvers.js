const shop = require('../Routes/salons');
const {ForbiddenError} = require('apollo-server-express')
const shopResolvers = {
	Query: {
		async shops() {
				return shop.getAllShops(); 
		}, 
	},
	Mutation: {
		createShop(_, args, context) {
		if(!context.user) throw new ForbiddenError("Unauthorized")
			shop.createNewShop(args);
			return args;
		},
	},
};

module.exports = { shopResolvers };
