import {createConnection} from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

const db = createConnection({
	host: process.env.DB_HOST || 'localhost',
	user: process.env.DB_USER || 'root',
	password: process.env.DB_ROOT_PASSWORD || '',
	database: process.env.DB_NAME || 'worldowe-salons',
});

export default db;
