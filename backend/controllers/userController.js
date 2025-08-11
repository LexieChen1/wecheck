import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
<<<<<<< HEAD
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
=======
import pool from "../database/index.js";
import { createUser, getUserByEmail, getAllUsers } from '../models/userModel.js';

export const registerUser = async (req, res) => {
  const { first_name, last_name, email } = req.body;
  const uid = req.user.uid;

  try {
    await pool.query(
      `INSERT INTO users (uid, first_name, last_name, email)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (uid) DO NOTHING`,
      [uid, first_name, last_name, email]
    );
    res.status(201).json({ message: "User registered" });
  } catch (err) {
    console.error("User registration failed:", err);
    res.status(500).json({ error: "Failed to register user" });
>>>>>>> bcf2f07dd586d7e049c78dd997b95b0726a6acce
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

<<<<<<< HEAD
  try {
    const result = await pool.query(
      `SELECT h.name AS house_name, h.invite_code, h.start_date, h.end_date
=======

  try {
    //get house info
    const houseResult = await pool.query(
      `SELECT h.id AS house_id, h.name AS house_name, h.invite_code, h.start_date, h.end_date
>>>>>>> bcf2f07dd586d7e049c78dd997b95b0726a6acce
       FROM users u
       LEFT JOIN houses h ON u.house_id = h.id
       WHERE u.uid = $1`,
      [uid]
    );

<<<<<<< HEAD
    console.log("House result:", result.rows);

    res.json(result.rows[0] || {});
=======
    const house = houseResult.rows[0];

    if (!house || !house.house_id) {
      return res.json({});
    }

    //get roommates
    const roommatesResult = await pool.query(
      `SELECT first_name, last_name, email FROM users WHERE house_id = $1`, 
      [house.house_id]
    ); 

    res.json({
      ...house, 
      roommates: roommatesResult.rows
    }); 
>>>>>>> bcf2f07dd586d7e049c78dd997b95b0726a6acce
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch house" });
  }
};
