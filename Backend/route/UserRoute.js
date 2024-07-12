import express from 'express'
import { login, signup, verifyToken,logout } from '../controllers/AuthController.js'


const router = express.Router()


router.post('/signup',signup)
router.post('/login',login)
router.post('/verifyToken', verifyToken);
router.post('/logout', logout);

export default router