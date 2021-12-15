const express = require('express');
const app = express();
const user = require('./Routes/user.js');
const port = process.env.PORT || 5000;
// const db = require('./Models/database.js');

require('dotenv').config();

app.use(express.urlencoded({ extended: true })); // New
app.use(express.json()); // New
app.get('/', (req, res) => {
	res.send('Hello World!');
});
app.post('/api/user/signup', user.signup);
app.get('/api/user/verify/:token', user.verifyUser);
app.listen(port, () => {
	console.log(`Example app listening at ${port}`);
});
