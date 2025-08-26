import express from 'express';
import verifyToken from '../middleware/auth.js';
import { pool } from "../database/index.js"; 

const router = express.Router();

// All bill routes require authentication
router.use(verifyToken);

// POST api/bills
router.post('/', verifyToken, async (req, res) => {
    try {
        const uid = req.user.uid; 
        const { description, amount, due_date } = req.body; 

        const result = await pool.query(
            `INSERT INTO bills (house_id, description, amount, due_date)
            VALUES (
                (SELECT house_id FROM users WHERE uid = $1), 
                $2, $3, $4
            )
            RETURNING *`, 
            [uid, description, amount, due_date]
        ); 

        res.json(result.rows[0]); 
    } catch (err) {
        console.error("Error adding bill:", err); 
        res.status(500).json({ error: "Failed to add bill" });
    }
}); 

// DELETE /api/bills/:id
router.delete("/:id", verifyToken, async (req, res) => {
    try {
      const { id } = req.params;
      await pool.query("DELETE FROM bills WHERE id = $1", [id]);
      res.json({ message: "Bill deleted" });
    } catch (err) {
      console.error("Error deleting bill:", err);
      res.status(500).json({ error: "Failed to delete bill" });
    }
  });

  // GET /api/bills/upcoming
router.get("/upcoming", verifyToken, async (req, res) => {
  try {
    const uid = req.user.uid;

    const result = await pool.query(
      `SELECT id, description, amount, due_date
       FROM bills
       WHERE house_id = (SELECT house_id FROM users WHERE uid = $1)
       ORDER BY due_date ASC`,
      [uid]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching upcoming bills:", err);
    res.status(500).json({ error: "Failed to load bills" });
  }
});
export default router; 