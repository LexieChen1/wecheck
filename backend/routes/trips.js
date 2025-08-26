import express from 'express';
import pool from '../../database/index.js'; 
import authenticateUser from "../middleware/auth.js";

const router = express.Router();

//add trip 
router.post('/add', authenticateUser, async (req, res) => {
  const createdBy = req.user.uid; 
  const { name, description, start_date, end_date, amount, people } = req.body;

  try {
    //insert trip into trip table
    const result = await pool.query(
      `INSERT INTO trips (name, description, created_by, start_date, end_date, amount)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [name, description || null, createdBy, start_date || null, end_date || null, amount || null]
    );
    const tripId = result.rows[0].id;

    //insert each person
    if (Array.isArray(people)){
      for (const person of people){
        await pool.query(
          `INSERT INTO people (trip_id, name, amount)
          VALUES ($1, $2, $3)`, 
          [tripId, person.name, person.amount || 0] 
        ); 
      }
    }
    res.status(201).json({ message: 'Trip Added Successfully', tripId}); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create trip' });
  }
});

//fetch all the trips 
router.get('/all', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.uid; 

    const result = await pool.query(
      'SELECT * FROM trips WHERE created_by = $1 ORDER BY start_date DESC', 
      [userId]
    ); 
    
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch trips!' });
  }
});

//for trip details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch trip
    const tripResult = await pool.query('SELECT * FROM trips WHERE id = $1', [id]);
    const trip = tripResult.rows[0];

    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    // Fetch people in the trip
    const peopleResult = await pool.query(
      'SELECT name, amount FROM people WHERE trip_id = $1',
      [id]
    );
    trip.people = peopleResult.rows;

    res.json(trip);
  } catch (err) {
    console.error('Error fetching trip detail:', err);
    res.status(500).json({ error: 'Failed to fetch trip' });
  }
});

//add members to a trip
router.post("/:tripId/add-members", authenticateUser, async (req, res) => {
  const { tripId } = req.params; 
  const { members } = req.body; 

  try {
    for (const member of members) {
      await pool.query(
        "INSERT INTO trip_members(trip_id, name, joined_at) VALUES ($1, $2, CURRENT_TIMESTAMP)", 
        [tripId, member.name]
      ); 
    }
    res.status(201).json({ message: "Friends added!" }); 
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: "server error" }); 
  }
}); 

export default router;