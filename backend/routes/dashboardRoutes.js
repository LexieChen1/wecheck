import express from "express";
import { pool } from "../database/index.js";
import authenticateUser from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticateUser, async (req, res) => {
  try {
    const uid = req.user.uid;

    // Find the user's house
    const houseRes = await pool.query(
      `SELECT house_id FROM users WHERE uid = $1`,
      [uid]
    );

    const houseId = houseRes.rows[0]?.house_id || null;
    if (!houseId) {
      return res.json({ bills: [], chores: [], notes: [] });
    }

    // House details
    const houseDetailsRes = await pool.query(
      `SELECT id, name, invite_code, start_date, end_date
       FROM houses
       WHERE id = $1`,
      [houseId]
    );

    // Upcoming bills for the house
    const billsRes = await pool.query(
      `SELECT id, description, amount, due_date
       FROM bills
       WHERE house_id = $1
       ORDER BY due_date ASC
       LIMIT 10`,
      [houseId]
    );

    // Chores assigned to this user
    const choresRes = await pool.query(
      `SELECT id, name, assigned_at
       FROM chores
       WHERE house_id = $1 AND assigned_to_uid = $2
       ORDER BY assigned_at DESC NULLS LAST, id DESC
       LIMIT 10`,
      [houseId, uid]
    );

    // Recent notes in the house with author name
    const notesRes = await pool.query(
      `SELECT n.id, n.content, n.created_at, u.first_name, u.last_name
       FROM notes n
       LEFT JOIN users u ON n.created_by_uid = u.uid
       WHERE n.house_id = $1
       ORDER BY n.created_at DESC
       LIMIT 10`,
      [houseId]
    );

    // Roommates in the house
    const roommatesRes = await pool.query(
      `SELECT uid, first_name, last_name, email
       FROM users
       WHERE house_id = $1
       ORDER BY created_at ASC`,
      [houseId]
    );

    res.json({
      house: houseDetailsRes.rows[0] || null,
      roommates: roommatesRes.rows || [],
      bills: billsRes.rows,
      chores: choresRes.rows,
      notes: notesRes.rows,
    });
  } catch (err) {
    console.error("Error fetching dashboard:", err);
    res.status(500).json({ error: "Failed to fetch dashboard" });
  }
});

export default router;