import dotenv from 'dotenv'

dotenv.config();

const config = {
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || '5432',
        name: process.env.DB_NAME || 'postgres',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres'
    },
    server: {
        port: process.env.PORT || 3001,
        env: process.env.NODE_ENV || 'development'
    },
}

export default config;