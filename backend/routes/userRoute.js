
import express from 'express';
import { createUser, getAllUsers } from '../controllers/userController.js';

const router = express.Router();

router.post('/signup', createUser);


router.get('/get-all', getAllUsers);

export default router;
