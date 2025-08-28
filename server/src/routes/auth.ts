import { Router } from "express";
import {login, signUp, verify} from "../controllers/auth.js"

const router = Router();

router.use('/login', login)
router.use('/signup', signUp)
router.use('/Verify', verify)

export default router;