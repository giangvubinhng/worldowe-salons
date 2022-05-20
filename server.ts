import express from "express"
import _  from "lodash";
// const {ApolloServer} = require("apollo-server-express");
import {ApolloServer} from 'apollo-server-express'
import {shopTypeDefs} from "./Schema/ShopTypeDefs";
import {shopResolvers} from "./Schema/ShopResolvers";
import passport from 'passport';
import user from "./Routes/user";
import shops from "./Routes/shop";
import cors from "cors";
import cookies from "cookie-parser";
import {authenticate_graphQL} from "./config/auth";

const port = process.env.PORT || 5000;
const app = express();
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
			const user = authenticate_graphQL(req);
			return {req, res, user};
		},
	});
	await server.start();
	server.applyMiddleware({app, path: "/api/graphql", cors: false});
	app.get("/", (req, res) => {
		res.send("Sorry, Worldowe is currently under development!");
	});
	app.use("/api/user", user);
	app.use("/api/shops", shops);
	app.listen(port, () => {
		console.log(`Worldowe app listening at ${port}`);
	});
}
startAppoloServer();
