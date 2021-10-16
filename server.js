const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true })); // New
app.use(express.json()); // New

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.listen(port, () => {
	console.log(`Example app listening at ${port}`);
});
