import express from 'express'
import { login, signup, verifyToken } from '../controllers/AuthController.js'

const router = express.Router()


router.post('/signup',signup)
router.post('/login',login)
router.post('/verifyToken', verifyToken);


export default router