import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  CloudUpload,
  CheckCircle,
  MedicalServices
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { uploadPrescription } from '../services/prescriptionService';

// Styled components
const UploadBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(8),
  textAlign: 'center',
  cursor: 'pointer',
  border: `2px dashed ${theme.palette.primary.main}`,
  minHeight: '300px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const GuideBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#fff',
  borderRadius: theme.spacing(1),
}));

const PrescriptionExample = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  margin: '16px auto',
  padding: theme.spacing(2),
  backgroundColor: '#fff',
  border: '1px solid #e0e0e0',
  borderRadius: '4px',
}));

const AnnotationLabel = styled(Typography)(({ theme }) => ({
  color: '#ff4d4f',
  fontWeight: 500,
  fontSize: '0.75rem',
  marginBottom: theme.spacing(0.5),
}));

const ExampleField = styled(Box)(({ theme }) => ({
  borderBottom: '1px dashed #ccc',
  padding: theme.spacing(0.5, 0),
  marginBottom: theme.spacing(0.5),
  color: '#666',
  fontSize: '0.75rem',
}));

const RequirementsList = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  '& > *': {
    marginBottom: theme.spacing(0.5),
  },
}));

const PrescriptionScannerPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [recognizedMedicines, setRecognizedMedicines] = useState([]);
  const [originalText, setOriginalText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const steps = ['Upload Prescription', 'Review Extracted Medicines', 'Save Prescription'];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a valid file (JPEG, PNG, or PDF)');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setError(null);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a valid file (JPEG, PNG, or PDF)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB');
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleProcessPrescription = async () => {
    if (!selectedFile) return;

    try {
      setLoading(true);
      setIsProcessing(true);
      
      const formData = new FormData();
      formData.append('file', selectedFile);

      const result = await uploadPrescription(formData);
      console.log('OCR API response:', result);
      
      if (result && result.medicines) {
        setRecognizedMedicines(result.medicines);
        setOriginalText(result.original_text || 'Text extraction not available');
        setActiveStep(1); // Move to review step
        enqueueSnackbar('Prescription processed successfully!', { variant: 'success' });
      } else {
        throw new Error('Invalid response from OCR service');
      }
    } catch (error) {
      console.error('Error processing prescription:', error);
      
      if (error.message === 'Authentication required') {
        enqueueSnackbar('Please login to process prescriptions', { variant: 'error' });
        navigate('/login');
      } else {
        setError(error.message || 'Error processing prescription');
        enqueueSnackbar('Failed to process prescription', { variant: 'error' });
      }
    } finally {
      setLoading(false);
      setIsProcessing(false);
    }
  };

  const handleSavePrescription = async () => {
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('prescription', selectedFile);
      formData.append('medicines', JSON.stringify(recognizedMedicines));
      formData.append('originalText', originalText);
      
      // Here you would make a call to save the prescription
      // For now we'll just navigate to the prescriptions page
      enqueueSnackbar('Prescription saved successfully!', { variant: 'success' });
      navigate('/prescriptions');
    } catch (error) {
      console.error('Error saving prescription:', error);
      setError(error.message || 'Error saving prescription');
      enqueueSnackbar('Failed to save prescription', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const renderUploadStep = () => (
    <Grid container spacing={3}>
      {/* Left side - Upload */}
      <Grid item xs={12} md={5}>
        <Paper sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Upload Your Prescription
          </Typography>
          
          <input
            type="file"
            accept="image/jpeg,image/png,image/jpg,application/pdf"
            style={{ display: 'none' }}
            id="prescription-upload"
            onChange={handleFileUpload}
          />

          <label htmlFor="prescription-upload" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <UploadBox
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              sx={{ mb: 3, flex: 1 }}
            >
              {selectedFile ? (
                <Box>
                  <CheckCircle color="success" sx={{ fontSize: 48, mb: 2 }} />
                  <Typography variant="body1" sx={{ mb: 1 }}>{selectedFile.name}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    Click to change file
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <CloudUpload sx={{ fontSize: 48, mb: 2, color: 'primary.main' }} />
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    Drag and drop your prescription here
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    or click to upload
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Supported formats: JPEG, PNG, PDF (Max size: 5MB)
                  </Typography>
                </Box>
              )}
            </UploadBox>
          </label>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={!selectedFile || loading}
            onClick={handleProcessPrescription}
            sx={{ py: 1.5 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Process Prescription'
            )}
          </Button>
        </Paper>
      </Grid>

      {/* Right side - Guidelines */}
      <Grid item xs={12} md={7}>
        <GuideBox>
          <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 500 }}>
            Guide for a valid prescription
          </Typography>

          <PrescriptionExample>
            {/* Doctor's Details Section */}
            <Box sx={{ mb: 2 }}>
              <AnnotationLabel>Doctor's details</AnnotationLabel>
              <ExampleField>Dr. Varun, MBBS, MD</ExampleField>
              <ExampleField>Name of Hospital / Clinic</ExampleField>
              <ExampleField>Address of Hospital / Clinic</ExampleField>
              <ExampleField>Regd. No.</ExampleField>
            </Box>

            {/* Patient's Details Section */}
            <Box sx={{ mb: 2 }}>
              <AnnotationLabel>Patient's details</AnnotationLabel>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <ExampleField>Name of Patient</ExampleField>
                  <ExampleField>Address of Patient</ExampleField>
                </Grid>
                <Grid item xs={6}>
                  <ExampleField>Age</ExampleField>
                  <ExampleField>Date of consultation</ExampleField>
                </Grid>
              </Grid>
            </Box>

            {/* Medicine Details Section */}
            <Box sx={{ mb: 2 }}>
              <AnnotationLabel>Medicine details</AnnotationLabel>
              <Grid container spacing={1} sx={{ mb: 0.5 }}>
                <Grid item xs={3}><Typography variant="caption">Medicine Name</Typography></Grid>
                <Grid item xs={3}><Typography variant="caption">Strength</Typography></Grid>
                <Grid item xs={3}><Typography variant="caption">Dose</Typography></Grid>
                <Grid item xs={3}><Typography variant="caption">Duration</Typography></Grid>
              </Grid>
              <Grid container spacing={1}>
                <Grid item xs={3}><ExampleField>E.g. Metformin</ExampleField></Grid>
                <Grid item xs={3}><ExampleField>500mg</ExampleField></Grid>
                <Grid item xs={3}><ExampleField>1-0-1</ExampleField></Grid>
                <Grid item xs={3}><ExampleField>6 months</ExampleField></Grid>
              </Grid>
            </Box>

            {/* Doctor's Sign Section */}
            <Box>
              <AnnotationLabel>Doctor's sign + stamp</AnnotationLabel>
              <Box sx={{ 
                border: '1px dashed #ccc', 
                p: 1, 
                textAlign: 'center',
                color: '#666',
                fontStyle: 'italic',
                fontSize: '0.75rem'
              }}>
                Doctor's Signature & Stamp
              </Box>
            </Box>
          </PrescriptionExample>

          <RequirementsList>
            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#666' }}>
              • Don't crop out any part of the image
            </Typography>
            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#666' }}>
              • Avoid blurred image
            </Typography>
            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#666' }}>
              • Include details of doctor and patient + clinic visit date
            </Typography>
            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#666' }}>
              • Medicines will be dispensed as per prescription
            </Typography>
            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#666' }}>
              • Supported files type: jpeg, jpg, png, pdf
            </Typography>
            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#666' }}>
              • Maximum allowed file size: 5MB
            </Typography>
          </RequirementsList>
        </GuideBox>
      </Grid>
    </Grid>
  );

  const renderReviewStep = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom>
            Extracted Medicines
          </Typography>
          
          {recognizedMedicines.length > 0 ? (
            <List>
              {recognizedMedicines.map((medicine, index) => (
                <Box key={index}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <MedicalServices sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="subtitle1" fontWeight={500}>
                            {medicine.brand_name}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box component="span" sx={{ mt: 1 }}>
                          <Box component="span" sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                            {medicine.dosage && (
                              <Chip size="small" label={`Dosage: ${medicine.dosage}`} />
                            )}
                            {medicine.frequency && (
                              <Chip size="small" label={`Frequency: ${medicine.frequency}`} />
                            )}
                            {medicine.duration && (
                              <Chip size="small" label={`Duration: ${medicine.duration}`} />
                            )}
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < recognizedMedicines.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          ) : (
            <Alert severity="info">No medicines recognized from the prescription.</Alert>
          )}
          
          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle2" gutterBottom>
              Original Text Extracted:
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f5f5f5' }}>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                {originalText || 'No text extracted'}
              </Typography>
            </Paper>
          </Box>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={handleBack} disabled={loading}>
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSavePrescription}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Prescription'}
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom align="center" color="primary" sx={{ mb: 3 }}>
          Prescription Scanner
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {activeStep === 0 && renderUploadStep()}
        {activeStep === 1 && renderReviewStep()}
      </Container>
      <Footer />
    </>
  );
};

export default PrescriptionScannerPage; 