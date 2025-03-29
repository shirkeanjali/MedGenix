import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  CloudUpload,
  CheckCircle,
  Send
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { uploadPrescription, storePrescriptionData } from '../services/prescriptionService';
import usePageLoading from '../hooks/usePageLoading';

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

const PrescriptionScanPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // Connect to loading system
  usePageLoading(loading, 'prescription-scan-page');

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

  const handleSubmit = async () => {
    if (!selectedFile) {
      enqueueSnackbar('Please select a file to upload', { variant: 'warning' });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Call the OCR API to process the prescription
      const result = await uploadPrescription(selectedFile);
      
      // Store the result in session storage for the next page
      storePrescriptionData(result);
      
      enqueueSnackbar('Prescription processed successfully!', { variant: 'success' });
      
      // Navigate to the results page
      navigate('/prescription-results');
    } catch (error) {
      console.error('Error processing prescription:', error);
      setError(error.message || 'Error processing prescription');
      enqueueSnackbar('Failed to process prescription', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom align="center" color="primary" sx={{ mb: 3 }}>
          Scan Prescription
        </Typography>

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
                onClick={handleSubmit}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                sx={{ py: 1.5 }}
              >
                {loading ? 'Processing...' : 'Process Prescription'}
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
      </Container>
      <Footer />
    </>
  );
};

export default PrescriptionScanPage;
