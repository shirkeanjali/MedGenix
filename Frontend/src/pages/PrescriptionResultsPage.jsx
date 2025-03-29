import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Paper,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Grid
} from '@mui/material';
import { 
  LocalPharmacy, 
  ArrowForward, 
  CheckCircle, 
  Download,
  Visibility,
  Add,
  ArrowBack
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { getPrescriptionData } from '../services/prescriptionService';
import usePageLoading from '../hooks/usePageLoading';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12
    }
  }
};

const PrescriptionResultsPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMed, setSelectedMed] = useState(null);
  const [prescriptionData, setPrescriptionData] = useState(null);
  const [error, setError] = useState(null);
  
  // Connect to loading system
  usePageLoading(isLoading, 'prescription-results-page');

  useEffect(() => {
    // Get the prescription data from session storage
    const data = getPrescriptionData();
    
    if (!data) {
      setError('No prescription data found. Please scan a prescription first.');
      setIsLoading(false);
      return;
    }
    
    setPrescriptionData(data);
    setIsLoading(false);
  }, []);

  const handleMedicineClick = (med) => {
    navigate(`/medicine/${med.brand_name}`, { state: { medicine: med } });
  };

  const handleFindGenerics = () => {
    // If we have prescription data with medicines, use them
    const medicines = prescriptionData?.medicines || [];
    navigate('/generic-alternatives', { state: { medicines } });
  };
  
  const handleBackToScan = () => {
    navigate('/scan-prescription');
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Check if we have prescription data with medicines
  const hasMedicines = prescriptionData && prescriptionData.medicines && prescriptionData.medicines.length > 0;
  const medicines = hasMedicines ? prescriptionData.medicines : [];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)',
      }}
    >
      <Header />
      <Box
        sx={{
          py: 4,
          px: 2,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: 'primary.main' }}>
              Prescription Results
            </Typography>
            
            <Button
              variant="outlined"
              color="primary"
              startIcon={<ArrowBack />}
              onClick={handleBackToScan}
              sx={{
                borderRadius: 2,
                px: 2,
                py: 1,
              }}
            >
              Scan Another Prescription
            </Button>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {!hasMedicines ? (
            <Paper 
              sx={{ 
                p: 4, 
                textAlign: 'center',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' 
              }}
            >
              <Typography variant="h6" gutterBottom>
                No Medicines Found
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                We couldn't extract any medicines from your prescription. Please try uploading a clearer image.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<ArrowBack />}
                onClick={handleBackToScan}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                }}
              >
                Try Again
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {/* Original Text */}
              <Grid item xs={12} md={4} component={motion.div} variants={containerVariants} initial="hidden" animate="visible">
                <motion.div variants={itemVariants}>
                  <Paper 
                    elevation={3} 
                    sx={{ 
                      p: 3, 
                      borderRadius: 2,
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600, 
                        color: 'primary.main', 
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      Original Text
                    </Typography>
                    
                    <Box 
                      sx={{ 
                        p: 2, 
                        backgroundColor: 'rgba(0, 0, 0, 0.02)', 
                        borderRadius: 1,
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        fontSize: '0.875rem',
                        color: 'text.secondary'
                      }}
                    >
                      {prescriptionData.original_text || 'No original text extracted'}
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
              
              {/* Extracted Medicines */}
              <Grid item xs={12} md={8} component={motion.div} variants={containerVariants} initial="hidden" animate="visible">
                <motion.div variants={itemVariants}>
                  <Paper 
                    elevation={3} 
                    sx={{ 
                      p: 3, 
                      borderRadius: 2,
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                      display: 'flex',
                      flexDirection: 'column',
                      border: '1px solid rgba(0, 0, 0, 0.05)',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '6px',
                        background: 'linear-gradient(to right, #67c27c, #008080)',
                      }
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600, 
                        color: 'primary.main', 
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: -8,
                          left: 0,
                          width: '60px',
                          height: '3px',
                          background: 'linear-gradient(to right, #67c27c, #008080)',
                          borderRadius: '4px',
                        }
                      }}
                    >
                      <LocalPharmacy sx={{ mr: 1 }} /> Extracted Medicines
                      <Chip 
                        label={`${medicines.length} found`} 
                        size="small" 
                        color="primary" 
                        sx={{ 
                          ml: 2, 
                          bgcolor: 'rgba(0, 128, 128, 0.1)', 
                          color: 'primary.main',
                          fontWeight: 500,
                          '& .MuiChip-label': {
                            px: 1
                          }
                        }}
                      />
                    </Typography>
                    
                    <List sx={{ mb: 3, flexGrow: 1 }}>
                      {medicines.map((med, index) => (
                        <motion.div 
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            type: 'spring', 
                            stiffness: 300,
                            delay: index * 0.1 
                          }}
                        >
                          <ListItem 
                            component="div"
                            sx={{ 
                              mb: 2, 
                              borderRadius: 2,
                              border: '1px solid',
                              borderColor: selectedMed === index ? 'primary.main' : 'rgba(0, 0, 0, 0.08)',
                              bgcolor: selectedMed === index ? 'rgba(103, 194, 124, 0.1)' : 'white',
                              transition: 'all 0.2s ease-in-out',
                              position: 'relative',
                              overflow: 'hidden',
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '6px',
                                height: '100%',
                                background: 'linear-gradient(to bottom, #67c27c, #008080)',
                                opacity: selectedMed === index ? 1 : 0.7,
                                transition: 'opacity 0.2s ease-in-out',
                              },
                              '&:hover': {
                                borderColor: 'primary.main',
                                bgcolor: 'rgba(103, 194, 124, 0.05)',
                                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                                '&::before': {
                                  opacity: 1,
                                }
                              },
                              pl: 3,
                              cursor: 'pointer'
                            }}
                            onClick={() => handleMedicineClick(med)}
                            onMouseEnter={() => setSelectedMed(index)}
                            onMouseLeave={() => setSelectedMed(null)}
                          >
                            <ListItemText 
                              primary={
                                <Typography variant="subtitle1" sx={{ 
                                  fontWeight: 600, 
                                  color: 'text.primary',
                                  fontSize: '1.05rem',
                                  display: 'flex',
                                  alignItems: 'center'
                                }}>
                                  {med.brand_name}
                                  {med.dosage && (
                                    <Chip 
                                      label={med.dosage} 
                                      size="small" 
                                      sx={{ 
                                        ml: 1.5, 
                                        fontSize: '0.75rem',
                                        backgroundColor: 'rgba(0, 128, 128, 0.08)',
                                        color: 'primary.main',
                                        fontWeight: 500,
                                        borderRadius: '4px',
                                        height: '22px'
                                      }} 
                                    />
                                  )}
                                </Typography>
                              }
                              secondary={
                                <Box sx={{ mt: 0.5 }}>
                                  {med.frequency && (
                                    <Typography 
                                      variant="body2"
                                      component="div"
                                      sx={{ 
                                        color: 'text.secondary',
                                        display: 'flex',
                                        alignItems: 'center',
                                        '& svg': {
                                          fontSize: '0.9rem',
                                          mr: 0.5,
                                          color: 'rgba(0, 128, 128, 0.7)'
                                        }
                                      }}
                                    >
                                      <Box component="span" sx={{ 
                                        display: 'inline-flex', 
                                        alignItems: 'center', 
                                        mr: 2,
                                        p: 0.5,
                                        pl: 1,
                                        pr: 1,
                                        borderRadius: '12px',
                                        backgroundColor: 'rgba(103, 194, 124, 0.07)',
                                        fontSize: '0.8rem',
                                      }}>
                                        {med.frequency}
                                      </Box>
                                    </Typography>
                                  )}
                                  {med.duration && (
                                    <Typography 
                                      variant="body2"
                                      component="div"
                                      sx={{ 
                                        color: 'text.secondary',
                                        display: 'flex',
                                        alignItems: 'center',
                                        '& svg': {
                                          fontSize: '0.9rem',
                                          mr: 0.5,
                                          color: 'rgba(0, 128, 128, 0.7)'
                                        }
                                      }}
                                    >
                                      <Box component="span" sx={{ 
                                        display: 'inline-flex', 
                                        alignItems: 'center', 
                                        ml: 1,
                                        p: 0.5,
                                        pl: 1,
                                        pr: 1,
                                        borderRadius: '12px',
                                        backgroundColor: 'rgba(103, 194, 124, 0.07)',
                                        fontSize: '0.8rem',
                                      }}>
                                        {med.duration}
                                      </Box>
                                    </Typography>
                                  )}
                                </Box>
                              }
                            />
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <Box sx={{ 
                                width: 36, 
                                height: 36, 
                                borderRadius: '50%', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                backgroundColor: selectedMed === index ? 'rgba(103, 194, 124, 0.2)' : 'transparent',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                  backgroundColor: 'rgba(103, 194, 124, 0.2)',
                                }
                              }}>
                                <ArrowForward 
                                  sx={{ 
                                    color: 'primary.main', 
                                    fontSize: '1.2rem',
                                    opacity: selectedMed === index ? 1 : 0.6,
                                    transition: 'all 0.2s ease-in-out'
                                  }} 
                                />
                              </Box>
                            </Box>
                          </ListItem>
                        </motion.div>
                      ))}
                    </List>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ textAlign: 'center' }}>
                      <motion.div
                        whileHover={{ 
                          scale: 1.03,
                          y: -3
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 10
                        }}
                      >
                        <Button
                          variant="contained"
                          size="large"
                          startIcon={<CheckCircle />}
                          onClick={handleFindGenerics}
                          disabled={medicines.length === 0}
                          sx={{
                            py: 1.5,
                            px: 4,
                            fontWeight: 600,
                            borderRadius: 8,
                            background: 'linear-gradient(45deg, #008080 30%, #67c27c 90%)',
                            boxShadow: '0 4px 15px rgba(0, 128, 128, 0.3)',
                            '&:hover': {
                              background: 'linear-gradient(45deg, #006666 30%, #5bb26c 90%)',
                              boxShadow: '0 6px 20px rgba(0, 128, 128, 0.4)',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          Find Generic Alternatives
                        </Button>
                      </motion.div>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mt: 2,
                          color: 'text.secondary',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          '& svg': {
                            fontSize: '1rem',
                            mr: 0.5,
                            color: '#67c27c'
                          }
                        }}
                      >
                        <CheckCircle fontSize="small" /> Save up to 70% on your medication
                      </Typography>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default PrescriptionResultsPage;
