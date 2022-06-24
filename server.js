const express = require("express");
const fileUpload = require('express-fileupload')
const _ = require("lodash");
const {ApolloServer} = require("apollo-server-express");
const app = express();
const {shopTypeDefs} = require("./Schema/ShopTypeDefs");
const {shopResolvers} = require("./Schema/ShopResolvers");
const {typeResolvers} = require("./Schema/ScalarTypeResolvers")
const passport = require("passport");
const user = require("./Routes/user.js");
const upload = require("./Routes/upload.js");
const cors = require("cors");
const cookies = require("cookie-parser");
const {authenticate_graphQL} = require("./config/auth");
const port = process.env.PORT || 5000;
require("./config/passport")(passport);
require("dotenv").config();

async function startAppoloServer() {
	app.use(express.urlencoded({extended: true}));
	app.use(express.json());
	app.use(fileUpload());
	app.use('/uploads', express.static(__dirname + '/uploads'));
	app.use(passport.initialize());
	app.use(cookies());
	app.use(
		cors({
			origin: [process.env.CLIENT_URI, "https://studio.apollographql.com"],
			credentials: true,
		})
	);
	const server = new ApolloServer({
		typeDefs: [shopTypeDefs],
		resolvers: _.merge({}, shopResolvers, typeResolvers),
		context: async ({req, res}) => {
			const user = await authenticate_graphQL(req);
			return {req, res, user};
		},
	});
	await server.start();
	server.applyMiddleware({app, path: "/api/graphql", cors: false});
	app.get("/", (req, res) => {
		res.send("Sorry, Worldowe is currently under development!");
	});
	app.use("/upload", upload)
	app.use("/api/user", user);
	app.listen(port, () => {
		console.log(`Worldowe app listening at ${port}`);
	});
}
startAppoloServer();
