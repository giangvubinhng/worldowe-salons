const {gql} = require("apollo-server-express");

const bookingTypeDefs = gql`
	#Scalars
	scalar Date
  # Types
  type Booking {
		id: Int!
    shop_id: Int!
    phone: String!
		customer_name: String!
		booking_created: Date!
		booking_start: Date!
		booking_end: Date!
		services: [String]!
		preferred_tech: String
  }

  # Input
  input IBooking {
    shop_id: Int!
    phone: String!
		customer_name: String!
		booking_start: Date!
		services: [String]!
		preferred_tech: String
  }

  # Queries
  type Query {
    bookings(shop_id: Int): [Booking]
    booking(id: Int): Booking
  }

  # Mutations
  type Mutation {
    createBooking(shop: IBooking!): Booking
		cancelBooking(id: Int!): Booking
  }
`;

module.exports = {bookingTypeDefs};
