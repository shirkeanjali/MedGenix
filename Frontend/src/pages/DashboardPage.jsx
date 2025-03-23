import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Avatar, 
  Button, 
  Card, 
  CardContent, 
  IconButton, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Switch,
  FormControlLabel,
  Divider,
  TextField,
  Tab,
  Tabs,
  useMediaQuery,
  Chip,
  Stack,
  Tooltip,
  CircularProgress,
  Checkbox,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { 
  MedicalServices, 
  MoreVert, 
  Edit, 
  ArrowUpward, 
  ArrowDownward,
  LocalHospital,
  Receipt,
  Medication,
  Savings,
  CalendarMonth,
  Visibility,
  InfoOutlined,
  BrightnessLow,
  DarkMode,
  Notifications,
  NotificationsActive,
  Check,
  KeyboardArrowRight,
  ContentCopy,
  Add,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useNavigate } from 'react-router-dom';

// Additional styles for medicine card flip effect
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
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
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
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
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4),
  },
}));

const StyledStatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
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

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 64,
  height: 64,
  marginRight: theme.spacing(2),
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  border: '2px solid #008080',
}));

const StyledIconAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: 'rgba(103, 194, 124, 0.15)',
  color: '#008080',
  width: 50,
  height: 50,
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)',
}));

const VisibilityIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'rgba(103, 194, 124, 0.1)',
  '&:hover': {
    backgroundColor: 'rgba(0, 128, 128, 0.2)',
  },
}));

const MedicineCard = styled(Paper)(({ theme }) => ({
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

const MedicineCardSide = styled(Box)(({ theme, isBack }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  backfaceVisibility: 'hidden',
  transform: isBack ? 'rotateY(180deg)' : 'rotateY(0deg)',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2),
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  '-webkit-backface-visibility': 'hidden',
}));

// Sample data
const savingsData = [
  { month: 'Jan', savings: 1200 },
  { month: 'Feb', savings: 1800 },
  { month: 'Mar', savings: 1400 },
  { month: 'Apr', savings: 2200 },
  { month: 'May', savings: 1900 },
  { month: 'Jun', savings: 2700 },
  { month: 'Jul', savings: 3100 },
];

const prescriptionHistoryData = [
  { 
    id: 1, 
    date: '2023-07-15', 
    medicineCount: 5, 
    savings: 850, 
    image: '/images/prescription1.jpg',
    medicines: [
      { name: 'Atorvastatin', generic: 'Atorvastatin', originalPrice: 230, genericPrice: 75 },
      { name: 'Lisinopril', generic: 'Lisinopril', originalPrice: 180, genericPrice: 35 },
      { name: 'Metformin', generic: 'Metformin', originalPrice: 210, genericPrice: 60 },
      { name: 'Levothyroxine', generic: 'Levothyroxine', originalPrice: 320, genericPrice: 120 },
      { name: 'Omeprazole', generic: 'Omeprazole', originalPrice: 290, genericPrice: 90 },
    ]
  },
  { 
    id: 2, 
    date: '2023-08-22', 
    medicineCount: 3, 
    savings: 620, 
    image: '/images/prescription2.jpg',
    medicines: [
      { name: 'Simvastatin', generic: 'Simvastatin', originalPrice: 450, genericPrice: 120 },
      { name: 'Amlodipine', generic: 'Amlodipine', originalPrice: 380, genericPrice: 110 },
      { name: 'Metoprolol', generic: 'Metoprolol', originalPrice: 310, genericPrice: 90 },
    ]
  },
  { 
    id: 3, 
    date: '2023-09-10', 
    medicineCount: 4, 
    savings: 750, 
    image: '/images/prescription3.jpg',
    medicines: [
      { name: 'Gabapentin', generic: 'Gabapentin', originalPrice: 520, genericPrice: 180 },
      { name: 'Sertraline', generic: 'Sertraline', originalPrice: 410, genericPrice: 140 },
      { name: 'Losartan', generic: 'Losartan', originalPrice: 350, genericPrice: 105 },
      { name: 'Albuterol', generic: 'Albuterol', originalPrice: 380, genericPrice: 115 },
    ]
  },
  { 
    id: 4, 
    date: '2023-10-05', 
    medicineCount: 2, 
    savings: 480, 
    image: '/images/prescription4.jpg',
    medicines: [
      { name: 'Hydrochlorothiazide', generic: 'Hydrochlorothiazide', originalPrice: 330, genericPrice: 85 },
      { name: 'Pantoprazole', generic: 'Pantoprazole', originalPrice: 450, genericPrice: 215 },
    ]
  },
  { 
    id: 5, 
    date: '2023-11-18', 
    medicineCount: 6, 
    savings: 1150, 
    image: '/images/prescription5.jpg',
    medicines: [
      { name: 'Citalopram', generic: 'Citalopram', originalPrice: 280, genericPrice: 70 },
      { name: 'Atenolol', generic: 'Atenolol', originalPrice: 260, genericPrice: 85 },
      { name: 'Fluoxetine', generic: 'Fluoxetine', originalPrice: 390, genericPrice: 120 },
      { name: 'Escitalopram', generic: 'Escitalopram', originalPrice: 450, genericPrice: 145 },
      { name: 'Montelukast', generic: 'Montelukast', originalPrice: 520, genericPrice: 210 },
      { name: 'Furosemide', generic: 'Furosemide', originalPrice: 230, genericPrice: 80 },
    ]
  },
];

const medicinesData = [
  { id: 1, name: 'Atorvastatin', generic: 'Atorvastatin', hasGeneric: true, savings: 155, category: 'Cholesterol' },
  { id: 2, name: 'Lisinopril', generic: 'Lisinopril', hasGeneric: true, savings: 145, category: 'Blood Pressure' },
  { id: 3, name: 'Metformin', generic: 'Metformin', hasGeneric: true, savings: 150, category: 'Diabetes' },
  { id: 4, name: 'Levothyroxine', generic: 'Levothyroxine', hasGeneric: true, savings: 200, category: 'Thyroid' },
  { id: 5, name: 'Omeprazole', generic: 'Omeprazole', hasGeneric: true, savings: 200, category: 'Acid Reflux' },
  { id: 6, name: 'Simvastatin', generic: 'Simvastatin', hasGeneric: true, savings: 330, category: 'Cholesterol' },
  { id: 7, name: 'Amlodipine', generic: 'Amlodipine', hasGeneric: true, savings: 270, category: 'Blood Pressure' },
  { id: 8, name: 'Metoprolol', generic: 'Metoprolol', hasGeneric: true, savings: 220, category: 'Heart' },
  { id: 9, name: 'Paracetamol', generic: 'Paracetamol', hasGeneric: true, savings: 340, category: 'Pain Relief' },
  { id: 10, name: 'Pantoprazole', generic: 'Pantoprazole', hasGeneric: true, savings: 235, category: 'Acid Reflux' },
  { id: 11, name: 'Amoxicillin', generic: 'Amoxicillin', hasGeneric: true, savings: 190, category: 'Antibiotic' },
  { id: 12, name: 'Losartan', generic: 'Losartan', hasGeneric: true, savings: 245, category: 'Blood Pressure' },
];

const DashboardPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  // State management
  const [userName, setUserName] = useState('John Doe');
  const [greeting, setGreeting] = useState('');
  const [totalSavings, setTotalSavings] = useState(0);
  const [totalPrescriptions, setTotalPrescriptions] = useState(0);
  const [totalMedicines, setTotalMedicines] = useState(0);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [medicineDetailsOpen, setMedicineDetailsOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [medicinesLoading, setMedicinesLoading] = useState(false);

  // Calculate totals and set greeting based on time of day
  useEffect(() => {
    // Calculate total savings
    const savings = prescriptionHistoryData.reduce((acc, item) => acc + item.savings, 0);
    setTotalSavings(savings);
    
    // Calculate total prescriptions
    setTotalPrescriptions(prescriptionHistoryData.length);
    
    // Calculate total medicines
    setTotalMedicines(medicinesData.length);
    
    // Set a generic greeting instead of time-based
    setGreeting('Welcome');
    
    // Simulate loading medicines
    setMedicinesLoading(true);
    setTimeout(() => {
      setMedicinesLoading(false);
    }, 1000);
  }, []);

  // Event handlers
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleViewDetails = (prescription) => {
    setSelectedPrescription(prescription);
    setDetailsDialogOpen(true);
  };

  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false);
  };

  const handleMedicineClick = (medicine) => {
    navigate(`/medicine/${medicine.id}`);
  };

  const handleCloseMedicineDetails = () => {
    setMedicineDetailsOpen(false);
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  const handleNotificationsToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

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
      <Header />
      <Box
        component="main"
        sx={{
          flex: 1,
          py: { xs: 4, md: 5 },
          px: { xs: 2, sm: 3, md: 4 },
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100%',
            backgroundImage: 'url(https://plus.unsplash.com/premium_photo-1664476984010-46bb839845f3?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fG1lZGljYWwlMjBlcXVpcG1lbnR8ZW58MHx8MHx8fDA%3D)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.3,
            zIndex: 0,
          }
        }}
      >
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
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
                      color: '#008080',
                      display: 'inline-block',
                    }}
                    component={motion.h1}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    {greeting}, {userName}!
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="#333333"
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
                        backgroundColor: '#67c27c',
                        borderRadius: '2px',
                      }
                    }}
                  >
                    Welcome to your MedGenix dashboard. Track your prescriptions, savings, and manage your healthcare needs all in one place.
                  </Typography>
                  
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      mt: { xs: 2, md: 'auto' },
                    }}
                    component={motion.div}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <Button
                      variant="contained"
                      sx={{ 
                        mr: 2,
                        px: 3,
                        py: 1.2,
                        backgroundColor: '#008080',
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(0, 128, 128, 0.3)',
                        '&:hover': {
                          backgroundColor: '#67c27c',
                          boxShadow: '0 6px 16px rgba(103, 194, 124, 0.4)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                      startIcon={<Add />}
                    >
                      Scan New Prescription
                    </Button>
                  </Box>
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
                      background: 'radial-gradient(circle at 30% 30%, rgba(103, 194, 124, 0.4) 0%, rgba(0, 128, 128, 0) 70%)',
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
                    <Avatar 
                      sx={{ 
                        bgcolor: 'primary.main',
                        color: 'white',
                        width: 64, 
                        height: 64,
                        marginRight: 2,
                        fontWeight: 'bold'
                      }}
                    >
                      {userName.split(' ').map(name => name[0]).join('')}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {userName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        johndoe@example.com
                      </Typography>
                      <Chip 
                        size="small" 
                        label="Premium Member" 
                        sx={{ 
                          mt: 0.5, 
                          bgcolor: 'rgba(0, 128, 128, 0.1)', 
                          color: 'primary.main',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                        }} 
                      />
                    </Box>
                    <IconButton 
                      sx={{ ml: 'auto' }}
                      aria-label="Edit profile"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
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
                    <Button
                      variant="outlined"
                      color="primary"
                      fullWidth
                      startIcon={<Edit />}
                      sx={{ 
                        mt: 2,
                        '&:hover': {
                          bgcolor: 'rgba(0, 128, 128, 0.08)'
                        }
                      }}
                    >
                      Edit Profile
                    </Button>
                  </Box>
                </StyledPaper>
              </Grid>
            </Grid>
          </motion.div>
          
          {/* Overview Section - Key Stats & Savings Graph */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Typography 
              variant="h5" 
              component="h2" 
              sx={{ 
                mb: 3, 
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center', 
              }}
            >
              Overview
              <Tooltip title="View detailed statistics for the last 6 months">
                <IconButton size="small" sx={{ ml: 1 }}>
                  <InfoOutlined fontSize="small" />
                </IconButton>
              </Tooltip>
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {/* Total Savings Card */}
              <Grid item xs={12} sm={6} lg={4}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <StyledStatCard>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <StyledIconAvatar>
                        <Savings />
                      </StyledIconAvatar>
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Total Savings
                        </Typography>
                        <Typography 
                          variant="h4" 
                          component="div" 
                          sx={{ 
                            fontWeight: 700,
                            color: '#008080',
                          }}
                        >
                          ₹{totalSavings}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        mt: 'auto', 
                        pt: 1,
                        borderTop: '1px dashed rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          bgcolor: 'rgba(0, 200, 83, 0.1)',
                          color: 'success.main',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                        }}
                      >
                        <ArrowUpward fontSize="small" sx={{ mr: 0.5, fontSize: '1rem' }} />
                        <Typography variant="body2" fontWeight={500}>
                          15.3%
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        from last month
                      </Typography>
                    </Box>
                  </StyledStatCard>
                </motion.div>
              </Grid>
              
              {/* Total Prescriptions Card */}
              <Grid item xs={12} sm={6} lg={4}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <StyledStatCard>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <StyledIconAvatar>
                        <Receipt />
                      </StyledIconAvatar>
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Total Prescriptions
                        </Typography>
                        <Typography 
                          variant="h4" 
                          component="div" 
                          sx={{ 
                            fontWeight: 700,
                            color: '#008080',
                          }}
                        >
                          {totalPrescriptions}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        mt: 'auto', 
                        pt: 1,
                        borderTop: '1px dashed rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          bgcolor: 'rgba(0, 200, 83, 0.1)',
                          color: 'success.main',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                        }}
                      >
                        <ArrowUpward fontSize="small" sx={{ mr: 0.5, fontSize: '1rem' }} />
                        <Typography variant="body2" fontWeight={500}>
                          3 New
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        in last 30 days
                      </Typography>
                    </Box>
                  </StyledStatCard>
                </motion.div>
              </Grid>
              
              {/* Total Medicines Card */}
              <Grid item xs={12} sm={6} lg={4}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <StyledStatCard>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <StyledIconAvatar>
                        <Medication />
                      </StyledIconAvatar>
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Total Medicines Extracted
                        </Typography>
                        <Typography 
                          variant="h4" 
                          component="div" 
                          sx={{ 
                            fontWeight: 700,
                            color: '#008080',
                          }}
                        >
                          {totalMedicines}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        mt: 'auto', 
                        pt: 1,
                        borderTop: '1px dashed rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          bgcolor: 'rgba(0, 200, 83, 0.1)',
                          color: 'success.main',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                        }}
                      >
                        <ArrowUpward fontSize="small" sx={{ mr: 0.5, fontSize: '1rem' }} />
                        <Typography variant="body2" fontWeight={500}>
                          6 New
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        in last 30 days
                      </Typography>
                    </Box>
                  </StyledStatCard>
                </motion.div>
              </Grid>
              
              {/* Savings Chart Card */}
              <Grid item xs={12}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <StyledPaper 
                    sx={{ 
                      p: 3, 
                      height: '100%',
                      minHeight: '320px',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h6" component="h3" fontWeight={600}>
                        Monthly Savings
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                          This Year
                        </Typography>
                        <IconButton size="small">
                          <MoreVert fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    
                    {/* Height set to ensure proper rendering */}
                    <Box sx={{ width: '100%', height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={savingsData}
                          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#67c27c" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#008080" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                          <XAxis 
                            dataKey="month" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#666' }}
                          />
                          <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#666' }}
                            tickFormatter={(value) => `₹${value}`}
                          />
                          <RechartsTooltip 
                            formatter={(value) => [`₹${value}`, 'Savings']}
                            contentStyle={{ 
                              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                              borderRadius: '8px',
                              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                              border: 'none',
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="savings" 
                            stroke="#008080" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colorSavings)" 
                            activeDot={{ r: 6, stroke: '#008080', strokeWidth: 2, fill: 'white' }}
                            animationDuration={1500}
                            animationEasing="ease-in-out"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Box>
                  </StyledPaper>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
          
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
              <TableContainer sx={{ overflow: 'auto', maxHeight: 440 }}>
                <Table sx={{ minWidth: 650 }} aria-label="prescription history table">
                  <TableHead>
                    <TableRow sx={{ '& th': { fontWeight: 600, color: theme.palette.primary.main } }}>
                      <TableCell>Date Uploaded</TableCell>
                      <TableCell align="center">Medicines Extracted</TableCell>
                      <TableCell align="center">Total Savings</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {prescriptionHistoryData.map((row) => (
                      <TableRow
                        key={row.id}
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
                        transition={{ duration: 0.3, delay: 0.1 * row.id }}
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
                              {new Date(row.date).toLocaleDateString('en-US', { 
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(row.date).toLocaleTimeString('en-US', { 
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Chip 
                              icon={<Medication fontSize="small" />}
                              label={`${row.medicineCount} Medicines`}
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
                        <TableCell align="center">
                          <Typography 
                            variant="body2" 
                            fontWeight={600}
                            sx={{ color: 'success.main' }}
                          >
                            ₹{row.savings}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <VisibilityIconButton
                            size="small"
                            onClick={() => handleViewDetails(row)}
                            aria-label="View prescription details"
                          >
                            <Visibility fontSize="small" />
                          </VisibilityIconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {/* Prescription Details Dialog */}
              <Dialog
                open={detailsDialogOpen}
                onClose={handleCloseDetailsDialog}
                maxWidth="md"
                fullWidth
                PaperProps={{
                  sx: { 
                    borderRadius: '16px',
                    overflowY: 'hidden', 
                  }
                }}
              >
                <DialogTitle 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                    py: 2,
                  }}
                >
                  <Receipt sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" component="span" fontWeight={600}>
                    Prescription Details
                  </Typography>
                  <Box sx={{ flexGrow: 1 }} />
                  <Button 
                    variant="text" 
                    color="inherit" 
                    onClick={handleCloseDetailsDialog}
                  >
                    Close
                  </Button>
                </DialogTitle>
                {selectedPrescription && (
                  <DialogContent sx={{ p: 0 }}>
                    <Grid container>
                      {/* Left side - Prescription Image */}
                      <Grid item xs={12} md={5} sx={{ 
                        bgcolor: 'rgba(0, 0, 0, 0.02)',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 3,
                      }}>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            mb: 2, 
                            color: 'text.secondary',
                            alignSelf: 'flex-start',
                          }}
                        >
                          Uploaded Prescription
                        </Typography>
                        
                        <Box 
                          sx={{ 
                            width: '100%',
                            height: '300px',
                            bgcolor: 'white',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 2,
                            mb: 2,
                          }}
                        >
                          <Typography color="text.secondary">
                            Prescription Image Placeholder
                          </Typography>
                        </Box>
                        
                        <Box 
                          sx={{ 
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Uploaded on {new Date(selectedPrescription.date).toLocaleDateString('en-US', { 
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </Typography>
                          <Button 
                            size="small"
                            startIcon={<ContentCopy fontSize="small" />}
                            variant="text"
                          >
                            Download
                          </Button>
                        </Box>
                      </Grid>
                      
                      {/* Right side - Medicines & Savings Details */}
                      <Grid item xs={12} md={7} sx={{ p: 3, maxHeight: '500px', overflow: 'auto' }}>
                        <Box sx={{ mb: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight={600}>
                              Extracted Medicines
                            </Typography>
                            <Chip 
                              label={`${selectedPrescription.medicines.length} Medicines`}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </Box>
                          
                          <List disablePadding>
                            {selectedPrescription.medicines.map((medicine, index) => (
                              <ListItem 
                                key={index}
                                sx={{ 
                                  px: 2, 
                                  py: 1,
                                  borderRadius: '8px',
                                  mb: 1,
                                  bgcolor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.02)' : 'transparent',
                                }}
                              >
                                <ListItemAvatar>
                                  <Avatar 
                                    sx={{ 
                                      bgcolor: 'rgba(0, 128, 128, 0.1)',
                                      color: 'primary.main',
                                    }}
                                  >
                                    <Medication />
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                  primary={
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                      <Typography variant="body2" fontWeight={500}>{medicine.name}</Typography>
                                      <Typography variant="body2" color="success.main" fontWeight={600}>
                                        Save ₹{medicine.originalPrice - medicine.genericPrice}
                                      </Typography>
                                    </Box>
                                  }
                                  secondary={
                                    <Box sx={{ mt: 0.5 }}>
                                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="caption" color="text.secondary">
                                          Original: <span style={{ textDecoration: 'line-through' }}>₹{medicine.originalPrice}</span>
                                        </Typography>
                                        <Typography variant="caption" color="primary.main" fontWeight={500}>
                                          Generic: ₹{medicine.genericPrice}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  }
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        {/* Savings Summary */}
                        <Box sx={{ bgcolor: 'rgba(0, 128, 128, 0.05)', p: 2, borderRadius: '8px' }}>
                          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                            Savings Breakdown
                          </Typography>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Original Cost:
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              ₹{selectedPrescription.medicines.reduce((sum, med) => sum + med.originalPrice, 0)}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Generic Cost:
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              ₹{selectedPrescription.medicines.reduce((sum, med) => sum + med.genericPrice, 0)}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: '1px dashed rgba(0, 0, 0, 0.1)' }}>
                            <Typography variant="subtitle2" color="primary.main" fontWeight={600}>
                              Total Savings:
                            </Typography>
                            <Typography variant="subtitle2" color="success.main" fontWeight={600}>
                              ₹{selectedPrescription.savings}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </DialogContent>
                )}
              </Dialog>
            </StyledPaper>
          </motion.div>
          
          {/* Your Extracted Medicines Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
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
              Your Extracted Medicines
              <Tooltip title="All medicines extracted from your prescriptions">
                <IconButton size="small" sx={{ ml: 1 }}>
                  <InfoOutlined fontSize="small" />
                </IconButton>
              </Tooltip>
            </Typography>
            
            {medicinesLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress color="primary" />
              </Box>
            ) : medicinesData.length === 0 ? (
              <StyledPaper sx={{ p: 4, textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>
                  <MedicalServices sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.4 }} />
                </Box>
                <Typography variant="h6" gutterBottom>
                  No Medicines Found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Upload a prescription to extract medicine information.
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  startIcon={<Add />}
                >
                  Scan New Prescription
                </Button>
              </StyledPaper>
            ) : (
              <Grid container spacing={4}>
                {medicinesData.slice(0, 8).map((medicine) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={medicine.id}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.1 * medicine.id % 8 }}
                      className="medicine-flip-card"
                      style={{ 
                        position: 'relative',
                        height: '300px'
                      }}
                    >
                      <MedicineCard 
                        className="medicine-flip-card"
                      >
                        {/* Front Side */}
                        <MedicineCardSide className="cardFront">
                          {/* Savings Badge */}
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 10,
                              left: 10,
                              bgcolor: 'success.main',
                              color: 'white',
                              borderRadius: '12px',
                              px: 1.5,
                              py: 0.5,
                              fontWeight: 600,
                              fontSize: '0.8rem',
                              boxShadow: '0 2px 8px rgba(0, 200, 83, 0.3)',
                              zIndex: 2,
                            }}
                          >
                            Save ₹{medicine.savings}
                          </Box>
                          
                          <Box 
                            sx={{ 
                              position: 'absolute', 
                              top: 10, 
                              right: 10,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              zIndex: 2,
                            }}
                          >
                            {medicine.hasGeneric ? (
                              <Chip 
                                label="Generic Available" 
                                size="small"
                                sx={{ 
                                  bgcolor: 'rgba(0, 200, 83, 0.1)',
                                  color: 'success.main',
                                  fontWeight: 500,
                                  fontSize: '0.7rem',
                                }}
                              />
                            ) : (
                              <Chip 
                                label="No Generic" 
                                size="small"
                                sx={{ 
                                  bgcolor: 'rgba(211, 47, 47, 0.1)',
                                  color: 'error.main',
                                  fontWeight: 500,
                                  fontSize: '0.7rem',
                                }}
                              />
                            )}
                          </Box>
                          
                          <Box sx={{ pt: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <motion.div
                              animate={{ rotateY: [0, 360] }}
                              transition={{
                                duration: 1.2,
                                delay: 0.2 * medicine.id % 8,
                                ease: "easeInOut"
                              }}
                              style={{ alignSelf: 'center' }}
                            >
                              <Avatar 
                                sx={{ 
                                  bgcolor: 'rgba(0, 128, 128, 0.1)',
                                  color: 'primary.main',
                                  width: 56,
                                  height: 56,
                                  mb: 2,
                                }}
                              >
                                <LocalHospital />
                              </Avatar>
                            </motion.div>
                            
                            <Typography 
                              variant="h6" 
                              align="center"
                              fontWeight={600}
                              sx={{ mb: 1 }}
                            >
                              {medicine.name}
                            </Typography>
                            
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>
                              {medicine.category}
                            </Typography>
                            
                            <Divider sx={{ my: 1 }} />
                            
                            <Box sx={{ mb: 1, mt: 'auto' }}>
                              <Typography variant="subtitle2" color="text.secondary">
                                Generic Alternative:
                              </Typography>
                              <Typography variant="body2" fontWeight={500} color="primary.main">
                                {medicine.generic}
                              </Typography>
                            </Box>
                            
                            <Box 
                              sx={{ 
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                              }}
                            >
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              >
                                <Tooltip title="Flip for usage info">
                                  <IconButton size="small" color="primary">
                                    <KeyboardArrowRight fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </motion.div>
                            </Box>
                          </Box>
                        </MedicineCardSide>
                        
                        {/* Back Side */}
                        <MedicineCardSide className="cardBack" isBack>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, textAlign: 'center' }}>
                            Usage Information
                          </Typography>
                          
                          <Box 
                            sx={{ 
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              height: '100%',
                              px: 1,
                            }}
                          >
                            <Box 
                              sx={{
                                bgcolor: 'rgba(0, 128, 128, 0.05)',
                                p: 2,
                                borderRadius: '12px',
                                textAlign: 'center',
                                mb: 2,
                                width: '100%',
                              }}
                            >
                              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                                {medicine.category === 'Cholesterol' && 'Lowers cholesterol levels by reducing the amount produced by the liver.'}
                                {medicine.category === 'Blood Pressure' && 'Controls hypertension by relaxing blood vessels for easier blood flow.'}
                                {medicine.category === 'Diabetes' && 'Controls blood sugar by improving insulin sensitivity.'}
                                {medicine.category === 'Thyroid' && 'Regulates thyroid function by replacing missing thyroid hormones.'}
                                {medicine.category === 'Acid Reflux' && 'Reduces stomach acid production to relieve heartburn.'}
                                {medicine.category === 'Heart' && 'Regulates heart rhythm and reduces strain on the heart.'}
                                {medicine.category === 'Pain Relief' && 'Reduces pain and fever by blocking pain signals.'}
                                {medicine.category === 'Antibiotic' && 'Treats bacterial infections by killing bacteria.'}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 'auto' }}>
                            <Typography 
                              variant="caption" 
                              color="text.secondary"
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              Tap to flip back
                            </Typography>
                          </Box>
                        </MedicineCardSide>
                      </MedicineCard>
                      
                      {/* More Details Button Below Card */}
                      <Box sx={{ 
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        textAlign: 'center',
                        padding: '4px', 
                        zIndex: 10
                      }}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          fullWidth
                          onClick={() => handleMedicineClick(medicine)}
                        >
                          More Details
                        </Button>
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      endIcon={<KeyboardArrowRight />}
                    >
                      View All Medicines
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            )}
            
            {/* Medicine Details Dialog */}
            <Dialog
              open={medicineDetailsOpen}
              onClose={handleCloseMedicineDetails}
              maxWidth="sm"
              fullWidth
              PaperProps={{
                sx: { borderRadius: '16px' }
              }}
            >
              {selectedMedicine && (
                <>
                  <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocalHospital sx={{ mr: 1 }} />
                      <Typography variant="h6" component="span" fontWeight={600}>
                        {selectedMedicine.name}
                      </Typography>
                    </Box>
                  </DialogTitle>
                  <DialogContent sx={{ mt: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Medicine Name
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          {selectedMedicine.name}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Generic Name
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          {selectedMedicine.generic}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Category
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          {selectedMedicine.category}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Potential Savings
                        </Typography>
                        <Typography variant="body1" color="success.main" fontWeight={600} gutterBottom>
                          ₹{selectedMedicine.savings}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Description
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          This is a sample description of the medication. In a real application, this would include
                          information about the drug's uses, side effects, dosage, and other important details.
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Found in Prescriptions
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                          {prescriptionHistoryData.slice(0, 3).map((prescription) => (
                            <Chip 
                              key={prescription.id}
                              label={new Date(prescription.date).toLocaleDateString('en-US', { 
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                              size="small"
                              variant="outlined"
                              onClick={() => {
                                handleCloseMedicineDetails();
                                handleViewDetails(prescription);
                              }}
                            />
                          ))}
                        </Stack>
                      </Grid>
                    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseMedicineDetails}>Close</Button>
                    <Button 
                      variant="contained" 
                      color="primary"
                      endIcon={<LocalHospital />}
                    >
                      Find Generic Options
                    </Button>
                  </DialogActions>
                </>
              )}
            </Dialog>
          </motion.div>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default DashboardPage; 