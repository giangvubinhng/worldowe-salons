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
    #Need to be worked on
    shop(id: Int): Shop
    # Need to be worked on
    myShops: [Shop]
  }

  # Mutations
  type Mutation {
    createShop(shop: IShop!): Shop
    # Need to be worked on
    addService(services: [String!]!): [String!]!
    # Need to be worked on
    addTechnician(techs: [String!]!): [String!]!
  }
`;

export { shopTypeDefs };
