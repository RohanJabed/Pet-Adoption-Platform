import express from 'express';
import {
  addToWishlist,
  removeFromWishlist,
  getMyWishlist,
} from '../controllers/wishlistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, addToWishlist);
router.delete('/:petId', protect, removeFromWishlist);
router.get('/', protect, getMyWishlist);

export default router;
