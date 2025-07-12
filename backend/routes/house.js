import express from "express";
import verifyToken from "../middleware/auth.js";
import pool from "../database/index.js";
import { nanoid } from "nanoid";

const router = express.Router();

router.post("/create", verifyToken, async (req, res) => {
  const { name } = req.body;
  const uid = req.user.uid;
  const inviteCode = nanoid(6); // optional: short code to invite others

  try {
    const result = await pool.query(
      `INSERT INTO houses (name, created_by_uid, invite_code)
       VALUES ($1, $2, $3) RETURNING id`,
      [name, uid, inviteCode]
    );

    const houseId = result.rows[0].id;

    // link current user to house
    await pool.query(
      `UPDATE users SET house_id = $1 WHERE uid = $2`,
      [houseId, uid]
    );

    res.status(201).json({ message: "House created", inviteCode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create house" });
  }
});

router.post("/join", verifyToken, async (req, res) => {
  const { code } = req.body;
  const uid = req.user.uid;

  const house = await pool.query(
    "SELECT id FROM houses WHERE invite_code = $1",
    [code]
  );

  if (house.rows.length === 0) {
    return res.status(404).json({ error: "House not found" });
  }

  await pool.query("UPDATE users SET house_id = $1 WHERE uid = $2", [
    house.rows[0].id,
    uid,
  ]);

  res.json({ message: "Joined house successfully" });
});


export default router;