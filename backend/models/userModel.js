import pool from '../../database/index.js';

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

export const getUserByUid = async (uid) => {
  const { rows } = await pool.query(
    `SELECT uid, first_name, last_name, phone, avatar_url, house_id, created_at, updated_at
     FROM users WHERE uid = $1`,
    [uid]
  );
  return rows[0];
};

export const upsertUserByUid = async ({ uid, email, firstName, lastName, phone, avatarUrl, houseId }) => {
  try {
    console.log("upsertUserByUid called with:", { uid, firstName, lastName, phone, avatarUrl, houseId });
    
    // Log the length of the avatar URL to debug the constraint issue
    if (avatarUrl) {
      console.log("Avatar URL length:", avatarUrl.length);
      console.log("Avatar URL preview:", avatarUrl.substring(0, 100) + "...");
    }
    
    const { rows } = await pool.query(
      `INSERT INTO users (uid, first_name, last_name, phone, avatar_url, house_id)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (uid) DO UPDATE SET
         first_name = COALESCE(EXCLUDED.first_name, users.first_name),
         last_name  = COALESCE(EXCLUDED.last_name, users.last_name),
         phone      = COALESCE(EXCLUDED.phone, users.phone),
         avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
         house_id   = COALESCE(EXCLUDED.house_id, users.house_id),
         updated_at = NOW()
       RETURNING uid, first_name, last_name, phone, avatar_url, house_id, created_at, updated_at`,
      [uid, firstName, lastName, phone, avatarUrl, houseId]
    );
    
    console.log("Database query successful, returned:", rows[0]);
    return rows[0];
  } catch (error) {
    console.error("Database error in upsertUserByUid:", error);
    console.error("Error details:", error.detail);
    console.error("Error constraint:", error.constraint);
    throw error;
  }
};