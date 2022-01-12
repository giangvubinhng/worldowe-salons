const salons = require('../Routes/salons');
const {ForbiddenError} = require('apollo-server-express')
const resolvers = {
	Query: {
		async salons() {
				return salons.getAllSalons(); 
		}, 
	},
	Mutation: {
		createShop(_, args, context) {
		if(!context.user) throw new ForbiddenError("Unauthorized")
			salons.createNewSalon(args);
			return args;
		},
	},
};

module.exports = { resolvers };
