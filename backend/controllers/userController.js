import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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
    //get house info
    const houseResult = await pool.query(
      `SELECT h.id AS house_id, h.name AS house_name, h.invite_code, h.start_date, h.end_date
       FROM users u
       LEFT JOIN houses h ON u.house_id = h.id
       WHERE u.uid = $1`,
      [uid]
    );

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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch house" });
  }
};
