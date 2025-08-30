

import { Router } from 'express';
import { getAllUsers } from '../controllers/dashboard.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = Router();

router.get('/users', isAuthenticated, getAllUsers); 


export default router;