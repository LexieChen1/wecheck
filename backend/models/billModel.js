import pool from '../../database/index.js';

export const createBillInDb = async ({ tripId, description, amount, paidBy, splitType }) => {
    const result = await pool.query(
    `INSERT INTO bills (trip_id, description, amount, paid_by, split_type)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [tripId, description, amount, paidBy, splitType]
  );
  // return the newest bill 
    return result.rows[0];
};

export const addBillSplit = async ({billId, userId, amount}) => {
    const result = await pool.query(
        `INSERT INTO bill_splits (bill_id, user_id, amount)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [billId, userId, amount]
    );
    return result.rows[0];
};

export const getBillsByTripId = async (tripId) => {
    const result = await pool.query(
        `SELECT * FROM bills
         WHERE trip_id = $1`,
        [tripId]
    );
    return result.rows;
};
