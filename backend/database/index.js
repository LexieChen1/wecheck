import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

// Database connection
const pool = new Pool({
    user: process.env.DB_USER || 'gameon_user',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'gameon',
    password: process.env.DB_PASSWORD || '5200',
    port: process.env.DB_PORT || 5433,
  });

export default pool;