import express from 'express';
import { 
  getUserPrescriptions, 
  createPrescription, 
  getPrescription, 
  updatePrescription, 
  deletePrescription,
  processPrescription 
} from '../controllers/prescriptionController.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get user prescriptions
router.get('/user', protect, getUserPrescriptions);

// Create prescription
router.post('/', protect, upload.single('prescription'), createPrescription);

// Get, update, delete a prescription
router.route('/:id')
  .get(protect, getPrescription)
  .put(protect, upload.single('prescription'), updatePrescription)
  .delete(protect, deletePrescription);

// Add a new route for OCR processing of prescriptions
router.post('/process', protect, upload.single('file'), processPrescription);

export default router; 