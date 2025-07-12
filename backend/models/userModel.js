import pool from '../database/index.js';

export const createUser = async ({ firstName, lastName, email, passwordHash, phone, avatarUrl }) => {
  const result = await pool.query(
    `INSERT INTO users (first_name, last_name, email, password_hash, phone, avatar_url)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, email, first_name, last_name, phone, avatar_url, created_at`,
    [firstName, lastName, email, passwordHash, phone || null, avatarUrl || null]
  );
  return result.rows[0];
};

export const getUserByEmail = async (email) => {
  const result = await pool.query(
    `SELECT id, email, first_name, last_name, password_hash, phone, avatar_url, created_at
     FROM users WHERE email = $1`,
    [email]
  );
  return result.rows[0];
};

export const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT id, first_name, last_name, email, created_at
     FROM users
     ORDER BY created_at DESC`
  );
  return result.rows;
};