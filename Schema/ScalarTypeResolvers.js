const { GraphQLScalarType } = require("graphql");

const dateScalar = new GraphQLScalarType({
    name: 'Date',
    parseValue(value) {
        return new Date(value); // Value from the client
    },
    serialize(value) {
        return value.toISOString(); // Value sent to the client
    }
})

const Typeresolvers = {
    Date: dateScalar
}

module.exports = { Typeresolvers }
