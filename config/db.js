import dotenv from 'dotenv';
import pg from 'pg';
import config from './config.js';

dotenv.config();

const {Pool} = pg;

const pool = new Pool({
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database,
});

pool.on('connect', () => {
    console.log('Connected to the database');
});

pool.on('error', (err) => {
    console.log('error idle cliendt', err);
    process.exit(-1)
});

export default pool;