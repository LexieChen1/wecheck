import pool from '../database/index.js';

export const createTrip = async ({ name, description, createdBy, startDate, endDate }) => {
  const result = await pool.query(
    `INSERT INTO trips (name, description, created_by, start_date, end_date)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, description, created_by, start_date, end_date, created_at`,
    [name, description, createdBy, startDate, endDate]
  );
  
  // Add creator as first member
  await addTripMember(result.rows[0].id, createdBy);
  
  return result.rows[0];
};

export const getTripsByUser = async (userId) => {
  const result = await pool.query(
    `SELECT t.id, t.name, t.description, t.created_by, t.start_date, t.end_date, t.created_at
     FROM trips t
     JOIN trip_members tm ON t.id = tm.trip_id
     WHERE tm.user_id = $1
     ORDER BY t.created_at DESC`,
    [userId]
  );
  return result.rows;
};

export const getTripById = async (tripId, userId) => {
  const result = await pool.query(
    `SELECT t.id, t.name, t.description, t.created_by, t.start_date, t.end_date, t.created_at
     FROM trips t
     JOIN trip_members tm ON t.id = tm.trip_id
     WHERE t.id = $1 AND tm.user_id = $2`,
    [tripId, userId]
  );
  return result.rows[0];
};

export const addTripMember = async (tripId, userId) => {
  const result = await pool.query(
    `INSERT INTO trip_members (trip_id, user_id)
     VALUES ($1, $2)
     ON CONFLICT (trip_id, user_id) DO NOTHING
     RETURNING trip_id, user_id`,
    [tripId, userId]
  );
  return result.rows[0];
};

export const getTripMembers = async (tripId) => {
  const result = await pool.query(
    `SELECT u.id, u.first_name, u.last_name, u.email, u.avatar_url
     FROM users u
     JOIN trip_members tm ON u.id = tm.user_id
     WHERE tm.trip_id = $1`,
    [tripId]
  );
  return result.rows;
}; 