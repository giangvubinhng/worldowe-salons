const { gql } = require('apollo-server-express');

const shopTypeDefs = gql`
	# Types
	type Shop {
		user_id: Int
		shop_name: String!
		street: String!
		city: String!
		state: String!
		country: String!
		zip: String!
		phone: String!
	}

	# Input
#	input Technician {
#		name: String!
#	}
#
#	input Service {
#		name: String!
#	}

	# Queries
	type Query {
		shops: [Shop]
	}

	# Mutations
	type Mutation {
		createShop(
			shop_name: String!
			shop_street: String!
			shop_city: String!
			shop_state: String!
			shop_country: String!
			shop_zip: String!
			phone: String!
			technicians: [String!]!
			services: [String!]!
		): Shop
	}
`;

module.exports = { shopTypeDefs };
