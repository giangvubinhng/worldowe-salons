const {gql} = require("apollo-server-express");

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
  
  type Booking{
    first_name: String!
    last_name: String!
    shop_id: Int!
    shop_name: String!
    date: String!
    services: [String]
    technician_name: String!
    technician_id: Int!
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
  input IBooking {
    first_name: String!
    last_name: String!
    shop_name: String!
    date: String!
    services: [String]
    technician_name: String!
    technician_id: Int!
  }

  # Queries
  type Query {
    shops: [Shop]
    #Need to be worked on
    shop(id: Int): Shop
    # Need to be worked on
    myShops: [Shop]
    bookings: [Booking]
  }

  # Mutations
  type Mutation {
    createBooking(booking: IBooking ): Booking
    createShop(shop: IShop): Shop
    # Need to be worked on
    addServices(services: [String!]!): [String!]!
    # Need to be worked on
    addTechnicians(techs: [String!]!): [String!]!
  }
`;

module.exports = {shopTypeDefs};
