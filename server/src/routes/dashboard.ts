import { Router } from 'express';
import { removeUser, deleteUser, getAllUsers, getDeletedUsers } from '../controllers/dashboard.js';

const router = Router();

router.get('/users', getAllUsers);
router.get('/users/remove/:id', removeUser);
router.delete('/users/delete/:id', deleteUser);
router.get('/users/deleted', getDeletedUsers);

export default router;
