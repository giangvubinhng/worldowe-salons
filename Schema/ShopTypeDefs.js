const {gql} = require("apollo-server-express");

const shopTypeDefs = gql`
	#Scalars
	scalar Date
  # Types
  type Shop {
    user_id: Int
    id: Int
    shop_name: String!
    street: String!
    city: String!
    state: String!
    country: String!
    zip: String!
    phone: String!
  }
	type Booking {
		id: Int
		shop_id: Int
		technician_id: Int
		customer_name: String
		created: Date
		



	}

  # Input
  input IShop {
    shop_name: String!
    street: String!
    city: String!
    state: String!
    country: String!
    zip: String!
    phone: String!
  }

  # Queries
  type Query {
    shops(name: String): [Shop]
    #Need to be worked on
    shop(id: Int): Shop
    # Need to be worked on
    myShops: [Shop]
  }

  # Mutations
  type Mutation {
    createShop(shop: IShop): Shop
    # Need to be worked on
    addServices(services: [String!]!): [String!]!
    # Need to be worked on
    addTechnicians(techs: [String!]!): [String!]!
  }
`;

module.exports = {shopTypeDefs};
