import express from 'express';
import verifyToken from '../middleware/auth.js';
import { createBill, getTripBills } from '../controllers/billController.js';

const router = express.Router();

// All bill routes require authentication
router.use(verifyToken);

// TODO: Add bill controllers and routes
router.post('/', createBill);  // POST api/bills
router.get('/:tripId', getTripBills); // GET /api/bills/:tripId

export default router; 