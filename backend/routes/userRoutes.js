import express from 'express';
<<<<<<< HEAD
import { getAllRegisteredUsers, getUserHouse, ensureUser } from '../controllers/userController.js';
=======
import { getAllRegisteredUsers, getUserHouse } from '../controllers/userController.js';
>>>>>>> bcf2f07dd586d7e049c78dd997b95b0726a6acce
import verifyToken from "../middleware/auth.js"

const router = express.Router();

router.get('/', getAllRegisteredUsers);
<<<<<<< HEAD
router.post("/ensure", verifyToken, ensureUser);
=======
>>>>>>> bcf2f07dd586d7e049c78dd997b95b0726a6acce
router.get('/house', verifyToken, getUserHouse);


export default router;
