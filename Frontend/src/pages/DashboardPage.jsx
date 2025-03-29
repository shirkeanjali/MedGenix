import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Paper,
  Typography,
  Button,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Container,
  Grid,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import {
  CalendarMonth,
  Medication,
  Visibility,
  MedicalServices,
  Edit,
  Add,
  InfoOutlined,
} from '@mui/icons-material';
import { formatDate } from '../utils/dateUtils';
import useApi from '../hooks/useApi';
import { GlobalStyle } from '../styles/GlobalStyle';

// Additional styles for medicine card flip effect
import { createGlobalStyle } from 'styled-components';

const MedicineCardGlobalStyle = createGlobalStyle`
  .medicine-flip-card {
    height: 250px;
    perspective: 1000px;
    transform-style: preserve-3d;
    margin-bottom: 48px;
  }
  
  .cardFront {
    z-index: 2;
    background-color: white;
  }
  
  .cardBack {
    z-index: 1;
    background-color: rgba(0, 128, 128, 0.03);
  }
`;

// Styled components
const StyledPaper = styled(Paper)(() => ({
  padding: '24px',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(8px)',
  background: 'rgba(255, 255, 255, 0.9)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  },
  '@media (min-width: 960px)': {
    padding: '32px',
  },
}));

const StyledStatCard = styled(Paper)(() => ({
  padding: '20px',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  backdropFilter: 'blur(8px)',
  background: 'rgba(255, 255, 255, 0.9)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)',
  },
}));

const StyledAvatar = styled(Avatar)(() => ({
  width: 80,
  height: 80,
  marginRight: '16px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  border: '2px solid #008080',
}));

const StyledIconAvatar = styled(Avatar)(() => ({
  backgroundColor: 'rgba(0, 128, 128, 0.1)',
  color: '#008080',
  width: 48,
  height: 48,
}));

const VisibilityIconButton = styled(IconButton)(() => ({
  backgroundColor: 'rgba(0, 128, 128, 0.1)',
  '&:hover': {
    backgroundColor: 'rgba(0, 128, 128, 0.2)',
  },
}));

const MedicineCard = styled(Paper)(() => ({
  padding: 0,
  borderRadius: '12px',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
  cursor: 'pointer',
  position: 'relative',
  height: '250px',
  transformStyle: 'preserve-3d',
  transition: 'transform 0.6s',
  '&:hover': {
    transform: 'rotateY(180deg)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12)',
  }
}));

const MedicineCardSide = styled(Box)(({ isBack }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  backfaceVisibility: 'hidden',
  transform: isBack ? 'rotateY(180deg)' : 'rotateY(0deg)',
  display: 'flex',
  flexDirection: 'column',
  padding: '16px',
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  '-webkit-backface-visibility': 'hidden',
}));

const ActionButton = styled(Button)(() => ({
  marginTop: '16px',
  padding: '12px',
  borderRadius: '8px',
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 4px 12px rgba(0, 128, 128, 0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(0, 128, 128, 0.3)',
  },
}));

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const api = useApi();
  
  // Add missing state variables
  const [totalSavings, setTotalSavings] = useState(1250);
  const [savingsData, setSavingsData] = useState([
    { month: 'Jan', savings: 200 },
    { month: 'Feb', savings: 300 },
    { month: 'Mar', savings: 250 },
    { month: 'Apr', savings: 380 },
    { month: 'May', savings: 400 },
    { month: 'Jun', savings: 500 },
    { month: 'Jul', savings: 450 },
    { month: 'Aug', savings: 480 },
    { month: 'Sep', savings: 600 },
    { month: 'Oct', savings: 750 },
    { month: 'Nov', savings: 800 },
    { month: 'Dec', savings: 1250 }
  ]);

  useEffect(() => {
    let isMounted = true;
    
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/prescriptions', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch prescriptions');
        }

        const data = await response.json();
        console.log('Fetched prescriptions:', data);

        if (isMounted) {
          // Transform the data to match PrescriptionDetailPage structure
          const transformedPrescriptions = data.prescriptions.map(prescription => ({
            _id: prescription._id,
            imageUrl: prescription.imageUrl,
            createdAt: prescription.createdAt,
            result: {
              medicines: prescription.medicines || [],
              doctor_name: prescription.doctor_name,
              hospital_name: prescription.hospital_name,
              date: prescription.date,
              patient_details: prescription.patient_details
            }
          }));

          setPrescriptions(transformedPrescriptions);
        }
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
        if (isMounted) {
          setError(error.message);
          setPrescriptions([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPrescriptions();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const handleScanPrescription = () => {
    navigate('/file-upload');
  };

  const handleViewPrescription = async (prescription) => {
    try {
      sessionStorage.setItem(`prescription_${prescription._id}`, JSON.stringify({
        _id: prescription._id,
        imageUrl: prescription.imageUrl,
        createdAt: prescription.createdAt,
        result: {
          medicines: prescription.result.medicines || [],
          doctor_name: prescription.result.doctor_name,
          hospital_name: prescription.result.hospital_name,
          date: prescription.result.date,
          patient_details: prescription.result.patient_details
        }
      }));
      
      navigate(`/prescription/${prescription._id}`);
    } catch (error) {
      console.error('Error handling prescription view:', error);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedPrescription(null);
  };

  // Calculate statistics from the fetched data
  const prescriptionCount = prescriptions.length;
  const medicineCount = prescriptions.reduce((total, prescription) => 
    total + (prescription.result?.medicines?.length || 0), 0
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)',
      }}
    >
      <GlobalStyle />
      <MedicineCardGlobalStyle />
      <Header />
      <Box
        component="main"
        sx={{
          flex: 1,
          py: { xs: 4, md: 5 },
          px: { xs: 2, sm: 3, md: 4 }
        }}
      >
        <Container maxWidth="xl">
          {/* Welcome Section - Personalized Greeting & Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={7}>
                {/* Animated Welcome Text */}
                <Box 
                  sx={{ 
                    position: 'relative',
                    overflow: 'hidden',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 700,
                      mb: 1,
                      background: 'linear-gradient(90deg, #006666 0%, #008080 50%, #00a0a0 100%)',
                      backgroundClip: 'text',
                      textFillColor: 'transparent',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      display: 'inline-block',
                    }}
                    component={motion.h1}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    Welcome, {user?.name?.split(' ')[0] || 'User'}!
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="text.secondary"
                    component={motion.p}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    sx={{ 
                      fontSize: '1.1rem',
                      maxWidth: '90%',
                      lineHeight: 1.5,
                      mb: 2,
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -10,
                        left: 0,
                        width: '40px',
                        height: '3px',
                        backgroundColor: 'primary.main',
                        borderRadius: '2px',
                      }
                    }}
                  >
                    Welcome to your MedGenix dashboard. Track your prescriptions, savings, and manage your healthcare needs all in one place.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={5}>
                {/* Profile Card */}
                <StyledPaper 
                  component={motion.div}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 3,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Subtle animated background */}
                  <Box 
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '100%',
                      opacity: 0.05,
                      background: 'radial-gradient(circle at 30% 30%, rgba(0, 128, 128, 0.4) 0%, rgba(0, 128, 128, 0) 70%)',
                      zIndex: 0,
                    }}
                    component={motion.div}
                    animate={{ 
                      backgroundPosition: ['0% 0%', '100% 100%'],
                      opacity: [0.03, 0.06, 0.03],
                    }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      repeatType: 'reverse',
                    }}
                  />
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, position: 'relative', zIndex: 1 }}>
                    <StyledAvatar src={user?.profilePhoto} alt={user?.name}>
                      {user?.name?.charAt(0)}
                    </StyledAvatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {user?.name?.split(' ')[0]}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user?.email}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box 
                    sx={{ 
                      mt: 'auto', 
                      display: 'flex',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    <ActionButton
                      variant="contained"
                      fullWidth
                      onClick={handleScanPrescription}
                      sx={{
                        bgcolor: '#008080',
                        '&:hover': { bgcolor: '#006666' }
                      }}
                      startIcon={<Add />}
                    >
                      Scan New Prescription
                    </ActionButton>
                  </Box>
                </StyledPaper>
              </Grid>
            </Grid>
          </motion.div>
          
          {/* Statistics Section */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <StyledStatCard>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <StyledIconAvatar>
                      <MedicalServices />
                    </StyledIconAvatar>
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#008080' }}>
                        {prescriptionCount}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Prescriptions
                      </Typography>
                    </Box>
                  </Box>
                </StyledStatCard>
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <StyledStatCard>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <StyledIconAvatar>
                      <Medication />
                    </StyledIconAvatar>
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#008080' }}>
                        {medicineCount}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Medicines
                      </Typography>
                    </Box>
                  </Box>
                </StyledStatCard>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <StyledStatCard>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <StyledIconAvatar>
                      <CalendarMonth />
                    </StyledIconAvatar>
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#008080' }}>
                        {new Date().toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Today's Date
                      </Typography>
                    </Box>
                  </Box>
                </StyledStatCard>
              </motion.div>
            </Grid>
          </Grid>
          
          {/* Prescription History Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Typography 
              variant="h5" 
              component="h2" 
              sx={{ 
                mt: 5,
                mb: 3, 
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center', 
              }}
            >
              Prescription History
              <Tooltip title="View all your previously scanned prescriptions">
                <IconButton size="small" sx={{ ml: 1 }}>
                  <InfoOutlined fontSize="small" />
                </IconButton>
              </Tooltip>
            </Typography>
            
            <StyledPaper>
              {!prescriptions || prescriptions.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body1" color="text.secondary">
                    Welcome to MedGenix! You haven't uploaded any prescriptions yet.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={handleScanPrescription}
                    sx={{ mt: 2 }}
                  >
                    Scan Your First Prescription
                  </Button>
                </Box>
              ) : (
                <TableContainer sx={{ overflow: 'auto', maxHeight: 440 }}>
                  <Table sx={{ minWidth: 650 }} aria-label="prescription history table">
                    <TableHead>
                      <TableRow sx={{ '& th': { fontWeight: 600, color: '#008080' } }}>
                        <TableCell>Date</TableCell>
                        <TableCell align="center">Medicines</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {prescriptions && prescriptions.map((prescription) => (
                        <TableRow
                          key={prescription._id}
                          hover
                          sx={{ 
                            '&:last-child td, &:last-child th': { border: 0 },
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': { 
                              backgroundColor: 'rgba(0, 128, 128, 0.05)',
                            },
                          }}
                          component={motion.tr}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                          whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                        >
                          <TableCell 
                            component="th" 
                            scope="row"
                            sx={{ 
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <Avatar 
                              sx={{ 
                                bgcolor: 'primary.light', 
                                color: 'white',
                                width: 36,
                                height: 36,
                                mr: 2,
                              }}
                            >
                              <CalendarMonth fontSize="small" />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={500}>
                                {formatDate(prescription.createdAt)}
                              </Typography>
                              {prescription.result?.doctor_name && (
                                <Typography variant="caption" color="text.secondary">
                                  Dr. {prescription.result.doctor_name}
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Chip 
                                icon={<Medication fontSize="small" />}
                                label={`${prescription.result?.medicines?.length || 0} Medicines`}
                                variant="outlined"
                                size="small"
                                sx={{ 
                                  borderColor: 'primary.light',
                                  color: 'primary.dark',
                                  '& .MuiChip-icon': { color: 'primary.main' },
                                }}
                              />
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="View Prescription">
                              <IconButton
                                onClick={() => handleViewPrescription(prescription)}
                                size="small"
                              >
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </StyledPaper>
          </motion.div>
        </Container>
      </Box>
      <Footer />

      {/* Prescription Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Prescription Details</DialogTitle>
        <DialogContent>
          {selectedPrescription && (
            <Box>
              <img
                src={selectedPrescription.imageUrl}
                alt="Prescription"
                style={{
                  width: '100%',
                  maxHeight: '500px',
                  objectFit: 'contain',
                  marginBottom: '16px'
                }}
              />
              <Typography variant="body1" gutterBottom>
                Uploaded on: {formatDate(selectedPrescription.createdAt)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardPage; 