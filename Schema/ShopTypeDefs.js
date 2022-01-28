const { gql } = require("apollo-server-express");

const shopTypeDefs = gql`
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
    shops: [Shop]
  }

  # Mutations
  type Mutation {
    createShop(shop: IShop!): Shop
    addService(services: [String!]!): [String]!
    addTechnician(techs: [String!]!): [String]!
  }
`;

module.exports = { shopTypeDefs };
