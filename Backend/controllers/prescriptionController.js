import { Prescription } from '../models/Prescription.js';

// Upload prescription
export const uploadPrescription = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Create prescription record with Cloudinary URL
    const prescription = new Prescription({
      imageUrl: req.file.path, // Cloudinary URL is automatically set by multer-storage-cloudinary
      medicines: req.body.medicines ? JSON.parse(req.body.medicines) : [], // Parse JSON string if present
      uploadedBy: req.user._id
    });

    await prescription.save();

    res.status(201).json({
      message: 'Prescription uploaded successfully',
      prescription
    });

  } catch (error) {
    console.error('Error uploading prescription:', error);
    res.status(500).json({ message: 'Error uploading prescription', error: error.message });
  }
};

// Get prescriptions for a user
export const getUserPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ uploadedBy: req.user._id })
      .sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    res.status(500).json({ message: 'Error fetching prescriptions', error: error.message });
  }
};

// Get single prescription
export const getPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    // Check if the prescription belongs to the requesting user
    if (prescription.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this prescription' });
    }

    res.json(prescription);
  } catch (error) {
    console.error('Error fetching prescription:', error);
    res.status(500).json({ message: 'Error fetching prescription', error: error.message });
  }
};

// Add a new function for OCR processing
export const processPrescription = async (req, res) => {
  try {
    // Log the request details
    console.log('Processing prescription OCR request');
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    // Log uploaded file details
    console.log('File received:', req.file.originalname, 'Size:', req.file.size);
    
    // In a real implementation, you would send the file to an OCR service here
    // For now, we'll return mock data
    
    // Simulate OCR processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create a mock OCR response
    const ocrResponse = {
      original_text: `Dr. Arun Sharma, MBBS, MD
City Medical Center
123 Health Street, Bangalore
Reg No: KA-98765

Patient: ${req.user ? req.user.name : 'John Doe'}
Age: 35
Date: ${new Date().toLocaleDateString()}

Rx

1. Celar 500mg - 1-0-1 - 5 days
2. Xamic 500mg - 1-0-1 - 7 days
3. Esobest 20mg - 0-0-1 - 10 days

Dr. Arun Sharma
(Signature)`,
      medicines: [
        {
          brand_name: "Celar",
          dosage: "500mg",
          frequency: "1-0-1",
          duration: "5 days"
        },
        {
          brand_name: "Xamic",
          dosage: "500mg",
          frequency: "1-0-1", 
          duration: "7 days"
        },
        {
          brand_name: "Esobest",
          dosage: "20mg",
          frequency: "0-0-1",
          duration: "10 days"
        }
      ]
    };
    
    // Log success
    console.log('Successfully processed prescription with OCR');
    
    // Return OCR results
    return res.status(200).json(ocrResponse);
    
  } catch (error) {
    console.error('Error processing prescription with OCR:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error processing prescription', 
      error: error.message 
    });
  }
}; 