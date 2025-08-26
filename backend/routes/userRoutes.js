import express from 'express';
import { getAllRegisteredUsers, getUserHouse, ensureUser } from '../controllers/userController.js';
import  authenticateUser from "../middleware/auth.js";

const router = express.Router();

router.get('/', getAllRegisteredUsers);
router.post("/ensure", authenticateUser, ensureUser);
router.get('/house', authenticateUser, getUserHouse);


export default router;
