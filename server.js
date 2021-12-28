const express = require('express');
const app = express();
const passport = require('passport');
const session = require('express-session');
const user = require('./Routes/user.js');
const salons = require('./Routes/salons');
const port = process.env.PORT || 5000;
// const db = require('./Models/database.js');

require('dotenv').config();
app.use(session({
		secret: 'someSecret',
		resave: false,
		saveUninitialized: true,
		cookie: {maxAge: 60 * 60 * 1000}
}));
app.use(express.urlencoded({ extended: true })); // New
app.use(express.json()); // New
app.use(passport.initialize());
app.use(passport.session());
app.get('/', (req, res) => {
	res.send('Sorry, Worldowe is currently under development!');
});
app.post('/api/signup', user.signup);
app.get('/api/user/verify/:token', user.verifyUser);
app.post('/api/login', user.signin);
app.get('/api/getSalons', salons.getAllSalons);
app.listen(port, () => {
	console.log(`Example app listening at ${port}`);
});
