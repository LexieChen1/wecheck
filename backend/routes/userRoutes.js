import express from 'express';
import { getAllRegisteredUsers, getUserHouse } from '../controllers/userController.js';
import verifyToken from "../middleware/auth.js"

const router = express.Router();

router.get('/', getAllRegisteredUsers);
router.get('/house', verifyToken, getUserHouse);


export default router;
