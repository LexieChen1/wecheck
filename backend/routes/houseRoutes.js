import express from "express";
import { authenticateUser as verifyToken } from "../middleware/auth.js";
import pool from "../../database/index.js";
import { nanoid } from "nanoid";

const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  const { name,  start_date, end_date  } = req.body;
  const uid = req.user.uid;
  const inviteCode = nanoid(6); // optional: short code to invite others
  

  try {
    const result = await pool.query(
      `INSERT INTO houses (name, created_by_uid, invite_code, start_date, end_date)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [name, uid, inviteCode, start_date, end_date]
    );

    const houseId = result.rows[0].id;

    await pool.query(
      `INSERT INTO users (uid, email)
       VALUES ($1, $2)
       ON CONFLICT (uid) DO NOTHING`,
      [req.user.uid, req.user.email]
    );

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

router.patch('/leave-house', verifyToken, async (req, res) => {
  const uid = req.user.uid;
  
  try {
    // First, get the user's current house_id
    const userResult = await pool.query(
      "SELECT house_id FROM users WHERE uid = $1",
      [uid]
    );
    
    if (userResult.rows.length === 0 || !userResult.rows[0].house_id) {
      return res.status(400).json({ error: "User is not in a house" });
    }
    
    const houseId = userResult.rows[0].house_id;
    
    // Check if this user is the only member of the house
    const membersResult = await pool.query(
      "SELECT COUNT(*) as member_count FROM users WHERE house_id = $1",
      [houseId]
    );
    
    const memberCount = parseInt(membersResult.rows[0].member_count);
    
    if (memberCount === 1) {
      // If this is the only member, delete the entire house and all related data
      console.log(`Deleting house ${houseId} and all associated data`);
      
      // Delete bills related to this house
      await pool.query("DELETE FROM bills WHERE house_id = $1", [houseId]);
      
      // Delete bill_splits related to this house (if any)
      await pool.query(
        "DELETE FROM bill_splits WHERE bill_id IN (SELECT id FROM bills WHERE house_id = $1)",
        [houseId]
      );
      
      // Remove user from house
      await pool.query("UPDATE users SET house_id = NULL WHERE uid = $1", [uid]);
      
      // Delete the house itself
      await pool.query("DELETE FROM houses WHERE id = $1", [houseId]);
      
      res.json({ message: "Left house and deleted all house data" });
    } else {
      // If there are other members, just remove this user from the house
      await pool.query("UPDATE users SET house_id = NULL WHERE uid = $1", [uid]);
      res.json({ message: "Left house" });
    }
  } catch (err) {
    console.error("Error leaving house:", err);
    res.status(500).json({ error: "Failed to leave house" });
  }
});

router.get("/user/:id", verifyToken, async (req, res) => {
  const userId = req.params.id;

  try {
    const house = await pool.query(`
      SELECT h.id, h.name,
             ARRAY_AGG(DISTINCT c.name) AS chores,
             ARRAY_AGG(DISTINCT b.description) AS bills
      FROM houses h
      JOIN users u ON u.house_id = h.id
      LEFT JOIN chores c ON c.house_id = h.id
      LEFT JOIN bills b ON b.house_id = h.id
      WHERE u.id = $1
      GROUP BY h.id
    `, [userId]);

    res.json(house.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching house data" });
  }
});

// add bills 
router.post("/add-bill", verifyToken, async (req, res) => {
  const { description, amount, due_date } = req.body;
  const uid = req.user.uid;

  try {
    const houseResult = await pool.query(
      `SELECT house_id FROM users WHERE uid = $1`,
      [uid]
    );

    const houseId = houseResult.rows[0]?.house_id;
    if (!houseId) return res.status(400).json({ error: "User not in a house" });

    await pool.query(
      `INSERT INTO bills (house_id, description, amount, due_date)
       VALUES ($1, $2, $3, $4)`,
      [houseId, description, amount, due_date]
    );

    res.status(201).json({ message: "Bill added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add bill" });
  }
});

router.get("/user/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await pool.query(
      `
      SELECT h.id AS house_id,
             h.name AS house_name,
             ARRAY_AGG(DISTINCT c.name) AS chores,
             ARRAY_AGG(DISTINCT b.description) AS bills,
             JSON_AGG(
               DISTINCT jsonb_build_object(
                 'id', u2.id,
                 'first_name', u2.first_name,
                 'last_name', u2.last_name,
                 'email', u2.email
               )
             ) AS members
      FROM houses h
      JOIN users u ON u.house_id = h.id
      LEFT JOIN chores c ON c.house_id = h.id
      LEFT JOIN bills b ON b.house_id = h.id
      LEFT JOIN users u2 ON u2.house_id = h.id
      WHERE u.id = $1
      GROUP BY h.id
      `,
      [userId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch house data" });
  }
});

router.get("/me", verifyToken, async (req, res) => {
  const uid = req.user.uid;

  try {
    const house = await pool.query(`
      SELECT h.id, h.name AS house_name, h.invite_code, h.start_date, h.end_date
      FROM users u
      JOIN houses h ON u.house_id = h.id
      WHERE u.uid = $1
    `, [uid]);

    if (house.rows.length === 0) {
      return res.status(404).json({ error: "No house found for user" });
    }

    res.json(house.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch house details" });
  }
});

// Get house members by house ID
router.get("/:id/members", verifyToken, async (req, res) => {
  const houseId = req.params.id;

  try {
    const members = await pool.query(`
      SELECT u.uid, u.first_name, u.last_name, u.phone, u.avatar_url, u.created_at
      FROM users u
      WHERE u.house_id = $1
    `, [houseId]);

    res.json(members.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch house members" });
  }
});

// Get house details by house ID
router.get("/:id", verifyToken, async (req, res) => {
  const houseId = req.params.id;

  try {
    const house = await pool.query(`
      SELECT h.id, h.name, h.invite_code, h.start_date, h.end_date, h.created_at
      FROM houses h
      WHERE h.id = $1
    `, [houseId]);

    if (house.rows.length === 0) {
      return res.status(404).json({ error: "House not found" });
    }

    res.json(house.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch house details" });
  }
});

// Get all chores for a house
router.get("/:id/chores", verifyToken, async (req, res) => {
  const houseId = req.params.id;

  try {
    const chores = await pool.query(`
      SELECT c.*, 
             creator.first_name as creator_first_name, creator.last_name as creator_last_name,
             assignee.first_name as assignee_first_name, assignee.last_name as assignee_last_name
      FROM chores c
      LEFT JOIN users creator ON c.created_by_uid = creator.uid
      LEFT JOIN users assignee ON c.assigned_to_uid = assignee.uid
      WHERE c.house_id = $1
      ORDER BY c.created_at DESC
    `, [houseId]);

    res.json(chores.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch chores" });
  }
});

// Add a new chore
router.post("/:id/chores", verifyToken, async (req, res) => {
  const houseId = req.params.id;
  const { name, description } = req.body;
  const createdByUid = req.user.uid;

  try {
    // Verify user is in this house
    const userHouse = await pool.query(
      "SELECT house_id FROM users WHERE uid = $1",
      [createdByUid]
    );

    if (userHouse.rows.length === 0 || userHouse.rows[0].house_id != houseId) {
      return res.status(403).json({ error: "User not in this house" });
    }

    const result = await pool.query(`
      INSERT INTO chores (house_id, name, description, created_by_uid)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [houseId, name, description, createdByUid]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create chore" });
  }
});

// Take/assign a chore
router.patch("/chores/:choreId/take", verifyToken, async (req, res) => {
  const choreId = req.params.choreId;
  const assignedToUid = req.user.uid;

  try {
    // Verify chore exists and user is in the same house
    const choreCheck = await pool.query(`
      SELECT c.house_id, u.house_id as user_house_id
      FROM chores c
      LEFT JOIN users u ON u.uid = $1
      WHERE c.id = $2
    `, [assignedToUid, choreId]);

    if (choreCheck.rows.length === 0) {
      return res.status(404).json({ error: "Chore not found" });
    }

    if (choreCheck.rows[0].house_id !== choreCheck.rows[0].user_house_id) {
      return res.status(403).json({ error: "User not in same house as chore" });
    }

    const result = await pool.query(`
      UPDATE chores 
      SET assigned_to_uid = $1, assigned_at = NOW()
      WHERE id = $2
      RETURNING *
    `, [assignedToUid, choreId]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to take chore" });
  }
});

// Mark chore as completed (delete it)
router.patch("/chores/:choreId/complete", verifyToken, async (req, res) => {
  const choreId = req.params.choreId;
  const userUid = req.user.uid;

  try {
    // Verify user is assigned to this chore or created it
    const choreCheck = await pool.query(`
      SELECT assigned_to_uid, created_by_uid, name
      FROM chores
      WHERE id = $1
    `, [choreId]);

    if (choreCheck.rows.length === 0) {
      return res.status(404).json({ error: "Chore not found" });
    }

    const chore = choreCheck.rows[0];
    if (chore.assigned_to_uid !== userUid && chore.created_by_uid !== userUid) {
      return res.status(403).json({ error: "Can only complete chores assigned to you or created by you" });
    }

    // Delete the chore when completed
    await pool.query(`DELETE FROM chores WHERE id = $1`, [choreId]);

    res.json({ message: "Chore completed and deleted", choreId, choreName: chore.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to complete chore" });
  }
});

// Return/cancel a chore (unassign it)
router.patch("/chores/:choreId/return", verifyToken, async (req, res) => {
  const choreId = req.params.choreId;
  const userUid = req.user.uid;

  try {
    // Verify user is assigned to this chore
    const choreCheck = await pool.query(`
      SELECT assigned_to_uid, is_completed
      FROM chores
      WHERE id = $1
    `, [choreId]);

    if (choreCheck.rows.length === 0) {
      return res.status(404).json({ error: "Chore not found" });
    }

    const chore = choreCheck.rows[0];
    if (chore.assigned_to_uid !== userUid) {
      return res.status(403).json({ error: "Can only return chores assigned to you" });
    }

    if (chore.is_completed) {
      return res.status(400).json({ error: "Cannot return completed chores" });
    }

    const result = await pool.query(`
      UPDATE chores 
      SET assigned_to_uid = NULL, assigned_at = NULL
      WHERE id = $1
      RETURNING *
    `, [choreId]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to return chore" });
  }
});

// Get all notes for a house
router.get("/:id/notes", verifyToken, async (req, res) => {
  const houseId = req.params.id;

  try {
    const notes = await pool.query(`
      SELECT n.*, 
             u.first_name, u.last_name
      FROM notes n
      LEFT JOIN users u ON n.created_by_uid = u.uid
      WHERE n.house_id = $1
      ORDER BY n.created_at DESC
    `, [houseId]);

    res.json(notes.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// Add a new note
router.post("/:id/notes", verifyToken, async (req, res) => {
  const houseId = req.params.id;
  const { content } = req.body;
  const createdByUid = req.user.uid;

  try {
    // Verify user is in this house
    const userHouse = await pool.query(
      "SELECT house_id FROM users WHERE uid = $1",
      [createdByUid]
    );

    if (userHouse.rows.length === 0 || userHouse.rows[0].house_id != houseId) {
      return res.status(403).json({ error: "User not in this house" });
    }

    const result = await pool.query(`
      INSERT INTO notes (house_id, content, created_by_uid)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [houseId, content, createdByUid]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create note" });
  }
});

// Delete a note
router.delete("/notes/:noteId", verifyToken, async (req, res) => {
  const noteId = req.params.noteId;
  const userUid = req.user.uid;

  try {
    // Verify user created this note
    const noteCheck = await pool.query(`
      SELECT created_by_uid
      FROM notes
      WHERE id = $1
    `, [noteId]);

    if (noteCheck.rows.length === 0) {
      return res.status(404).json({ error: "Note not found" });
    }

    if (noteCheck.rows[0].created_by_uid !== userUid) {
      return res.status(403).json({ error: "Can only delete notes you created" });
    }

    await pool.query(`DELETE FROM notes WHERE id = $1`, [noteId]);

    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete note" });
  }
});

// Get all buy list items for a house
router.get("/:id/buylist", verifyToken, async (req, res) => {
  const houseId = req.params.id;

  try {
    const items = await pool.query(`
      SELECT b.*, 
             creator.first_name as creator_first_name, creator.last_name as creator_last_name,
             purchaser.first_name as purchaser_first_name, purchaser.last_name as purchaser_last_name
      FROM buy_list b
      LEFT JOIN users creator ON b.created_by_uid = creator.uid
      LEFT JOIN users purchaser ON b.purchased_by_uid = purchaser.uid
      WHERE b.house_id = $1
      ORDER BY b.is_purchased ASC, b.created_at DESC
    `, [houseId]);

    res.json(items.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch buy list" });
  }
});

// Add a new item to buy list
router.post("/:id/buylist", verifyToken, async (req, res) => {
  const houseId = req.params.id;
  const { item } = req.body;
  const createdByUid = req.user.uid;

  try {
    // Verify user is in this house
    const userHouse = await pool.query(
      "SELECT house_id FROM users WHERE uid = $1",
      [createdByUid]
    );

    if (userHouse.rows.length === 0 || userHouse.rows[0].house_id != houseId) {
      return res.status(403).json({ error: "User not in this house" });
    }

    const result = await pool.query(`
      INSERT INTO buy_list (house_id, item, created_by_uid)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [houseId, item, createdByUid]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add item to buy list" });
  }
});

// Mark item as purchased
router.patch("/buylist/:itemId/purchase", verifyToken, async (req, res) => {
  const itemId = req.params.itemId;
  const purchasedByUid = req.user.uid;

  try {
    // Verify item exists and user is in the same house
    const itemCheck = await pool.query(`
      SELECT b.house_id, u.house_id as user_house_id
      FROM buy_list b
      LEFT JOIN users u ON u.uid = $1
      WHERE b.id = $2
    `, [purchasedByUid, itemId]);

    if (itemCheck.rows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    if (itemCheck.rows[0].house_id !== itemCheck.rows[0].user_house_id) {
      return res.status(403).json({ error: "User not in same house as item" });
    }

    const result = await pool.query(`
      UPDATE buy_list 
      SET is_purchased = TRUE, purchased_by_uid = $1, purchased_at = NOW()
      WHERE id = $2
      RETURNING *
    `, [purchasedByUid, itemId]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to mark item as purchased" });
  }
});

// Delete a purchased item
router.delete("/buylist/:itemId", verifyToken, async (req, res) => {
  const itemId = req.params.itemId;
  const userUid = req.user.uid;

  try {
    // Verify item exists and user permissions
    const itemCheck = await pool.query(`
      SELECT created_by_uid, purchased_by_uid, is_purchased
      FROM buy_list
      WHERE id = $1
    `, [itemId]);

    if (itemCheck.rows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    const item = itemCheck.rows[0];
    
    // Only allow deletion if:
    // 1. User created the item, OR
    // 2. User purchased the item (and it's purchased)
    const canDelete = item.created_by_uid === userUid || 
                     (item.purchased_by_uid === userUid && item.is_purchased);

    if (!canDelete) {
      return res.status(403).json({ error: "Can only delete items you created or purchased" });
    }

    await pool.query(`DELETE FROM buy_list WHERE id = $1`, [itemId]);

    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete item" });
  }
});

export default router;