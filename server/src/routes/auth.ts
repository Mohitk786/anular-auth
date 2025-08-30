import { Router } from "express";
import {forgotPassword, login, resendOtp, resetPassword, signUp, verify} from "../controllers/auth.js"

const router = Router();

router.use('/login', login)
router.use('/signup', signUp)
router.use('/Verify', verify)
router.use('/forgot-password', forgotPassword)
router.use('/reset-password', resetPassword)
router.use('/resend-otp', resendOtp)


export default router;