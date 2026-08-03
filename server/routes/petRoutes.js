import express from 'express';
import {
  createPet,
  getPets,
  getPetById,
  updatePet,
  deletePet,
  getMyListings,
} from '../controllers/petController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getPets);
router.get('/my-listings', protect, getMyListings);
router.get('/:id', getPetById);
router.post('/', protect, createPet);
router.put('/:id', protect, updatePet);
router.delete('/:id', protect, deletePet);

export default router;
