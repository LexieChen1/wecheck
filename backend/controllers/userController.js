import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from "../../database/index.js";
import { createUser, getUserByEmail, getAllUsers } from '../models/userModel.js';

export const ensureUser = async (req, res) => {
  const { uid, email } = req.user || {}; // set by verifyToken (firebase-admin)
  const {
    first_name = "",
    last_name = "",
    avatar_url = "",
  } = req.body || {};

  if (!uid) return res.status(401).json({ error: "Unauthorized" });

  try {
    await pool.query(
      `INSERT INTO users (uid, email, first_name, last_name, avatar_url)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (uid) DO UPDATE
         SET email = EXCLUDED.email,
             first_name = EXCLUDED.first_name,
             last_name = EXCLUDED.last_name,
             avatar_url = EXCLUDED.avatar_url`,
      [uid, email ?? "", first_name, last_name, avatar_url]
    );
    return res.sendStatus(204);
  } catch (e) {
    console.error("ensureUser error:", e);
    return res.status(500).json({ error: "DB error" });
  }
};

export const getAllRegisteredUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json({
      users: users.map(user => ({
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        createdAt: user.created_at
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const getUserHouse = async (req, res) => {
  const uid = req.user.uid;
  console.log("Looking up house for UID:", uid);

  try {
    const result = await pool.query(
      `SELECT h.name AS house_name, h.invite_code, h.start_date, h.end_date
       FROM users u
       LEFT JOIN houses h ON u.house_id = h.id
       WHERE u.uid = $1`,
      [uid]
    );

    console.log("House result:", result.rows);

    res.json(result.rows[0] || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch house" });
  }
};
