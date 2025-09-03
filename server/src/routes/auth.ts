import { Router } from "express";
import {forgotPassword, login, resendOtp, resetPassword, signUp, verify} from "../controllers/auth.js"

const router = Router();

router.post('/login', login)
router.post('/signup', signUp)
router.post('/Verify', verify)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.post('/resend-otp', resendOtp)


export default router;