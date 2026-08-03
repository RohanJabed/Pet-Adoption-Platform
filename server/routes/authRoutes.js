import express from 'express';
import {
  registerUser,
  loginUser,
  googleLogin,
  logoutUser,
  getMe,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google-login', googleLogin);
router.post('/logout', protect, logoutUser);
router.get('/me', protect, getMe);

export default router;
