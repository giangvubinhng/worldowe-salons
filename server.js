const express = require('express');
const app = express();
const passport = require('passport');
//const session = require('express-session');
const user = require('./Routes/user.js');
const salons = require('./Routes/salons');
const cors = require('cors');
const cookies = require("cookie-parser")
const port = process.env.PORT || 5000;
require('./config/passport')(passport);
require('dotenv').config();
//app.use(
//	session({
//		secret: 'someSecret',
//		resave: false,
//		saveUninitialized: true,
//		cookie: { maxAge: 60 * 60 * 1000 },
//	})
//);
app.use(express.urlencoded({ extended: true })); // New
app.use(express.json()); // New
app.use(passport.initialize());
//app.use(passport.session());
app.use(function(req, res, next) {
		res.header("Access-Control-Allow-Credentials", "http://localhost:3000");
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(cookies())
app.use(cors({origin: 'http://localhost:3000',credentials: true}));
app.get('/', (req, res) => {
	res.send('Sorry, Worldowe is currently under development!');
});
app.use(user);
app.get('/api/getShops', salons.getAllSalons);
app.post(
	'/api/createShop',
	passport.authenticate('jwt', { session: false }),
	salons.createNewSalon
);
app.listen(port, () => {
	console.log(`Example app listening at ${port}`);
});
