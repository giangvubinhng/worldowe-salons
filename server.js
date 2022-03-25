const express = require("express");
const _ = require("lodash");
const {ApolloServer} = require("apollo-server-express");
const app = express();
const {shopTypeDefs} = require("./Schema/ShopTypeDefs");
const {shopResolvers} = require("./Schema/ShopResolvers");
const passport = require("passport");
const user = require("./Routes/user.js");
const cors = require("cors");
const cookies = require("cookie-parser");
const {authUser} = require("./config/auth");
const port = process.env.PORT || 5000;
require("./config/passport")(passport);
require("dotenv").config();

async function startAppoloServer() {
	app.use(express.urlencoded({extended: true})); // New
	app.use(express.json()); // New
	app.use(passport.initialize());
	app.use(cookies());
	app.use(
		cors({
			origin: ["http://localhost:3000", "https://studio.apollographql.com"],
			credentials: true,
		})
	);
	const server = new ApolloServer({
		typeDefs: [shopTypeDefs],
		resolvers: _.merge({}, shopResolvers),
		context: ({req, res}) => {
			const user = authUser(req);
			return {req, res, user};
		},
	});
	await server.start();
	server.applyMiddleware({app, path: "/api/graphql", cors: false});
	app.get("/", (req, res) => {
		res.send("Sorry, Worldowe is currently under development!");
	});
	app.use("/api", user);
	app.listen(port, () => {
		console.log(`Example app listening at ${port}`);
	});
}
startAppoloServer();
