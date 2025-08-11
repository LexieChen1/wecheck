import express from 'express';
import { getAllRegisteredUsers, getUserHouse, ensureUser } from '../controllers/userController.js';
import verifyToken from "../middleware/auth.js"

const router = express.Router();

router.get('/', getAllRegisteredUsers);
router.post("/ensure", verifyToken, ensureUser);
router.get('/house', verifyToken, getUserHouse);


export default router;
