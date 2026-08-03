import express from 'express';
import {
  submitRequest,
  getMyRequests,
  cancelRequest,
  getPetRequests,
  updateRequestStatus,
} from '../controllers/requestController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, submitRequest);
router.get('/my-requests', protect, getMyRequests);
router.delete('/:id', protect, cancelRequest);
router.get('/listings/:petId', protect, getPetRequests);
router.put('/:id', protect, updateRequestStatus);

export default router;
