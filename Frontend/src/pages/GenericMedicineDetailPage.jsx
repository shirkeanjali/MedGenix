import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Button,
  Paper,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Link
} from '@mui/material';
import {
  ExpandMore,
  VerifiedUser,
  LocalHospital,
  MedicalServices,
  ErrorOutline,
  CheckCircleOutline,
  KeyboardArrowRight,
  Science,
  InfoOutlined,
  ShoppingCart,
  LocationOn,
  Store,
  QuestionAnswer,
  MedicalInformation,
  Compare,
  RocketLaunch
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { styled } from '@mui/material/styles';

// Sample medicine data (would come from an API in a real app)
const genericMedicineData = {
  id: 2,
  name: 'Atorvastatin',
  brand: 'Generic',
  category: 'Cholesterol',
  usageInfo: 'Atorvastatin is used along with a proper diet to help lower "bad" cholesterol and fats (such as LDL, triglycerides) and raise "good" cholesterol (HDL) in the blood. It belongs to a group of drugs known as "statins." It works by reducing the amount of cholesterol made by the liver.',
  howItWorks: 'Atorvastatin belongs to a group of medicines called HMG-CoA reductase inhibitors, or "statins." It lowers the level of cholesterol and triglycerides in the blood by blocking an enzyme that is needed to make cholesterol.',
  activeIngredients: 'Each tablet contains atorvastatin calcium equivalent to 10 mg, 20 mg, 40 mg, or 80 mg atorvastatin.',
  sideEffects: [
    {
      severity: 'Common',
      effects: [
        'Diarrhea',
        'Upset stomach',
        'Muscle and joint pain',
        'Alterations in some laboratory tests'
      ]
    },
    {
      severity: 'Less Common',
      effects: [
        'Muscle problems',
        'Liver problems',
        'Memory problems or confusion',
        'Increased blood sugar'
      ]
    },
    {
      severity: 'Rare',
      effects: [
        'Allergic reactions',
        'Severe muscle damage (rhabdomyolysis)',
        'Liver damage',
        'Kidney problems'
      ]
    }
  ],
  doctorVerified: {
    name: 'Dr. Anand Sharma',
    specialty: 'Cardiologist',
    date: '15 Jan 2023'
  },
  brandId: 1,
  price: 85.30,
  priceComparison: [
    { 
      platform: 'PharmEasy', 
      price: 85.30, 
      discount: '10% OFF',
      link: 'https://pharmeasy.in',
      deliveryDays: '1-2 days',
      isAvailable: true
    },
    { 
      platform: 'Netmeds', 
      price: 90.20, 
      discount: '5% OFF',
      link: 'https://netmeds.com',
      deliveryDays: '2-3 days',
      isAvailable: true
    },
    { 
      platform: 'Apollo Pharmacy', 
      price: 82.50, 
      discount: '15% OFF',
      link: 'https://apollopharmacy.in',
      deliveryDays: '1 day',
      isAvailable: true
    },
    { 
      platform: 'MedPlus', 
      price: 88.75, 
      discount: '8% OFF',
      link: 'https://medplusmart.com',
      deliveryDays: '2-3 days',
      isAvailable: true
    }
  ],
  expertAdvice: {
    doctor: 'Dr. Meera Patel',
    qualification: 'M.D., Clinical Pharmacology',
    advice: 'Generic atorvastatin is biologically equivalent to the brand-name medication. When switching from brand to generic, maintain the same dosage and continue regular cholesterol monitoring. Report any unusual side effects to your healthcare provider immediately. The effectiveness of cholesterol reduction should remain consistent after switching.',
    date: 'February 2023'
  },
  faqs: [
    {
      question: 'Is generic atorvastatin as effective as the brand-name version?',
      answer: 'Yes, generic atorvastatin contains the same active ingredient and is required by law to be as safe and effective as the brand-name version. The FDA ensures that generic medications provide the same clinical benefits.'
    },
    {
      question: 'Can I switch between brand and generic versions?',
      answer: "Yes, you can switch between brand and generic versions of atorvastatin. However, it's recommended to consult with your healthcare provider before making any changes to your medication."
    },
    {
      question: 'Are there any differences in side effects between generic and brand?',
      answer: 'Generic and brand-name atorvastatin share the same potential side effects. Any differences are typically related to inactive ingredients, which rarely cause issues for most patients.'
    },
    {
      question: 'Why is generic atorvastatin less expensive?',
      answer: "Generic medications are less expensive because manufacturers don't have to repeat costly clinical trials that the brand-name manufacturers conducted. Additionally, competition among multiple generic manufacturers helps lower the price."
    }
  ],
  brandComparison: {
    efficacy: "The generic version contains the same active ingredient and provides the same therapeutic effect as the brand-name version.",
    cost: "The generic version typically costs 70-85% less than the brand-name equivalent.",
    quality: "Generic medications are regulated by the FDA and must meet the same quality standards as brand-name medications.",
    availability: "Generic atorvastatin is widely available at most pharmacies across India."
  }
};

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
  marginBottom: theme.spacing(3),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4),
  },
}));

const VerifiedBadge = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'rgba(76, 175, 80, 0.1)',
  borderRadius: '12px',
  padding: theme.spacing(1, 2),
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  border: '1px solid rgba(76, 175, 80, 0.3)',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.primary.main,
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(1),
  },
}));

const FindPharmacyButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(1.5, 3),
  borderRadius: '12px',
  fontSize: '1.1rem',
  fontWeight: 600,
  boxShadow: '0 4px 14px rgba(0, 128, 128, 0.4)',
  '&:hover': {
    boxShadow: '0 6px 20px rgba(0, 128, 128, 0.5)',
  },
}));

const PriceTableRow = styled(TableRow)(({ theme, isHighlighted }) => ({
  background: isHighlighted ? 'rgba(0, 128, 128, 0.08)' : 'transparent',
  '&:hover': {
    background: 'rgba(0, 128, 128, 0.12)',
  },
  transition: 'background 0.3s ease, transform 0.3s ease',
}));

const PlatformLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  fontWeight: 500,
  '&:hover': {
    textDecoration: 'underline',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1rem',
    marginLeft: '4px',
  },
}));

// Main component
const GenericMedicineDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const mapRef = useRef(null);

  // Animations
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Fetch medicine data
  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        // In a real app, this would be an API call
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo purposes, we're using sample data
        setMedicine(genericMedicineData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching medicine details:', err);
        setError('Failed to load medicine details. Please try again.');
        setLoading(false);
      }
    };

    fetchMedicine();
  }, [id]);

  // Navigate to branded medicine page
  const handleNavigateToBranded = () => {
    if (medicine?.brandId) {
      navigate(`/medicine/${medicine.brandId}`);
    }
  };

  // Find lowest price
  const getLowestPrice = () => {
    if (!medicine?.priceComparison?.length) return null;
    return medicine.priceComparison.reduce((lowest, current) => 
      current.price < lowest.price ? current : lowest, 
      medicine.priceComparison[0]
    );
  };
  
  const lowestPrice = medicine ? getLowestPrice() : null;

  if (loading) {
    return (
      <>
        <Header />
        <Container sx={{ py: 8, minHeight: '100vh' }}>
          <Box display="flex" justifyContent="center" alignItems="center" height="50vh" flexDirection="column">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <LocalHospital color="primary" sx={{ fontSize: 60, mb: 2 }} />
            </motion.div>
            <Typography variant="h6" color="textSecondary">Loading medicine details...</Typography>
          </Box>
        </Container>
        <Footer />
      </>
    );
  }

  if (error || !medicine) {
    return (
      <>
        <Header />
        <Container sx={{ py: 8, minHeight: '100vh' }}>
          <Box display="flex" justifyContent="center" alignItems="center" height="50vh" flexDirection="column">
            <ErrorOutline color="error" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h6" color="error">{error || "Medicine not found"}</Typography>
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ mt: 3 }}
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </Button>
          </Box>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 }, minHeight: '100vh' }}>
        {/* Medicine Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <Box 
            sx={{ 
              mb: 4, 
              pb: 2, 
              borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', md: 'center' }
            }}
          >
            <Box>
              <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                {medicine.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                <Chip 
                  label="Generic" 
                  color="secondary" 
                  icon={<Science />} 
                  sx={{ fontWeight: 500 }}
                />
                <Chip 
                  label={medicine.category} 
                  variant="outlined" 
                  color="primary" 
                  sx={{ fontWeight: 500 }}
                />
                <Chip 
                  label={`₹${medicine.price.toFixed(2)}`} 
                  color="success" 
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </Box>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Compare />}
              onClick={handleNavigateToBranded}
              sx={{ mt: { xs: 2, md: 0 }, fontWeight: 600 }}
            >
              Compare with Branded Version
            </Button>
          </Box>
        </motion.div>

        <Grid container spacing={4}>
          {/* Left Column */}
          <Grid item xs={12} md={7}>
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {/* Overview Section */}
              <motion.div variants={fadeInUp}>
                <StyledPaper>
                  <SectionTitle variant="h5">
                    <MedicalInformation /> Overview
                  </SectionTitle>
                  <Typography paragraph>{medicine.usageInfo}</Typography>
                  <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>How it works</Typography>
                  <Typography paragraph>{medicine.howItWorks}</Typography>
                  
                  <VerifiedBadge>
                    <VerifiedUser color="success" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Verified by {medicine.doctorVerified.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {medicine.doctorVerified.specialty} • {medicine.doctorVerified.date}
                      </Typography>
                    </Box>
                  </VerifiedBadge>
                </StyledPaper>
              </motion.div>

              {/* Side Effects Section */}
              <motion.div variants={fadeInUp}>
                <StyledPaper sx={{ mt: 4 }}>
                  <SectionTitle variant="h5">
                    <ErrorOutline /> Possible Side Effects
                  </SectionTitle>
                  
                  {medicine.sideEffects.map((sideEffect, index) => (
                    <Accordion 
                      key={index} 
                      sx={{ 
                        mb: 2, 
                        boxShadow: 'none', 
                        border: '1px solid rgba(0, 0, 0, 0.12)',
                        borderRadius: '8px',
                        '&:before': { display: 'none' },
                        overflow: 'hidden'
                      }}
                    >
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography sx={{ fontWeight: 600 }}>
                          {sideEffect.severity} Side Effects
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <List disablePadding>
                          {sideEffect.effects.map((effect, i) => (
                            <ListItem key={i} sx={{ py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 36 }}>
                                <KeyboardArrowRight color="primary" />
                              </ListItemIcon>
                              <ListItemText primary={effect} />
                            </ListItem>
                          ))}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    <InfoOutlined sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                    If you experience any severe or persistent side effects, contact your healthcare provider immediately.
                  </Typography>
                </StyledPaper>
              </motion.div>

              {/* Expert Advice Section */}
              <motion.div variants={fadeInUp}>
                <StyledPaper sx={{ mt: 4 }}>
                  <SectionTitle variant="h5">
                    <MedicalServices /> Expert Advice
                  </SectionTitle>
                  
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: 'primary.main', 
                        width: 56, 
                        height: 56,
                        mr: 2
                      }}
                    >
                      {medicine.expertAdvice.doctor.split(' ').map(name => name[0]).join('')}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {medicine.expertAdvice.doctor}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {medicine.expertAdvice.qualification} • {medicine.expertAdvice.date}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography paragraph sx={{ fontStyle: 'italic', pl: 2, borderLeft: '4px solid', borderColor: 'primary.main' }}>
                    "{medicine.expertAdvice.advice}"
                  </Typography>
                </StyledPaper>
              </motion.div>
            </motion.div>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={5}>
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {/* Price Comparison Section */}
              <motion.div variants={fadeInUp}>
                <StyledPaper>
                  <SectionTitle variant="h5">
                    <Compare /> Price Comparison
                  </SectionTitle>
                  
                  {lowestPrice && (
                    <Box 
                      sx={{ 
                        bgcolor: 'success.light', 
                        color: 'success.contrastText',
                        p: 2,
                        borderRadius: 2,
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircleOutline sx={{ mr: 1 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          Best Price: ₹{lowestPrice.price.toFixed(2)} at {lowestPrice.platform}
                        </Typography>
                      </Box>
                      <Chip 
                        label={lowestPrice.discount} 
                        color="primary" 
                        size="small" 
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                  )}
                  
                  <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid rgba(0, 0, 0, 0.12)' }}>
                    <Table>
                      <TableHead sx={{ bgcolor: 'primary.light' }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Platform</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Discount</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Delivery</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {medicine.priceComparison.map((platform, index) => (
                          <PriceTableRow 
                            key={index}
                            isHighlighted={platform.platform === lowestPrice?.platform}
                          >
                            <TableCell>
                              <PlatformLink href={platform.link} target="_blank" rel="noopener">
                                {platform.platform} <RocketLaunch fontSize="small" />
                              </PlatformLink>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 500 }}>₹{platform.price.toFixed(2)}</TableCell>
                            <TableCell>
                              <Chip 
                                label={platform.discount} 
                                color="secondary" 
                                size="small"
                                sx={{ fontWeight: 500 }}
                              />
                            </TableCell>
                            <TableCell>{platform.deliveryDays}</TableCell>
                          </PriceTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    <InfoOutlined sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                    Prices and availability may vary. Last updated: Today
                  </Typography>
                </StyledPaper>
              </motion.div>

              {/* Brand vs Generic Comparison */}
              <motion.div variants={fadeInUp}>
                <StyledPaper sx={{ mt: 4 }}>
                  <SectionTitle variant="h5">
                    <Compare /> Brand vs Generic
                  </SectionTitle>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
                          border: '1px solid rgba(0, 128, 128, 0.2)',
                          borderRadius: 2,
                          bgcolor: 'rgba(0, 128, 128, 0.05)'
                        }}
                      >
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Efficacy</Typography>
                        <Typography variant="body2">{medicine.brandComparison.efficacy}</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12}>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
                          border: '1px solid rgba(0, 128, 128, 0.2)',
                          borderRadius: 2,
                          bgcolor: 'rgba(0, 128, 128, 0.05)'
                        }}
                      >
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Cost Savings</Typography>
                        <Typography variant="body2">{medicine.brandComparison.cost}</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12}>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
                          border: '1px solid rgba(0, 128, 128, 0.2)',
                          borderRadius: 2,
                          bgcolor: 'rgba(0, 128, 128, 0.05)'
                        }}
                      >
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Quality Assurance</Typography>
                        <Typography variant="body2">{medicine.brandComparison.quality}</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12}>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
                          border: '1px solid rgba(0, 128, 128, 0.2)',
                          borderRadius: 2,
                          bgcolor: 'rgba(0, 128, 128, 0.05)'
                        }}
                      >
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Availability</Typography>
                        <Typography variant="body2">{medicine.brandComparison.availability}</Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </StyledPaper>
              </motion.div>

              {/* FAQs Section */}
              <motion.div variants={fadeInUp}>
                <StyledPaper sx={{ mt: 4 }}>
                  <SectionTitle variant="h5">
                    <QuestionAnswer /> FAQs
                  </SectionTitle>
                  
                  {medicine.faqs.map((faq, index) => (
                    <Accordion 
                      key={index} 
                      expanded={activeFaq === index}
                      onChange={() => setActiveFaq(activeFaq === index ? null : index)}
                      sx={{ 
                        mb: 2, 
                        boxShadow: 'none', 
                        border: '1px solid rgba(0, 0, 0, 0.12)',
                        borderRadius: '8px',
                        '&:before': { display: 'none' },
                        overflow: 'hidden'
                      }}
                    >
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography sx={{ fontWeight: 600 }}>
                          {faq.question}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography>{faq.answer}</Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </StyledPaper>
              </motion.div>

              {/* Find Pharmacy Section */}
              <motion.div variants={fadeInUp}>
                <StyledPaper sx={{ mt: 4 }}>
                  <SectionTitle variant="h5">
                    <LocationOn /> Find Nearby Pharmacies
                  </SectionTitle>
                  
                  <Typography paragraph>
                    Find pharmacies near you that stock {medicine.name} at affordable prices.
                  </Typography>
                  
                  {/* Placeholder for map - would be Google Maps in a real app */}
                  <Box 
                    ref={mapRef}
                    sx={{ 
                      height: 200, 
                      bgcolor: 'rgba(0, 0, 0, 0.05)', 
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px dashed rgba(0, 0, 0, 0.2)',
                      mb: 2
                    }}
                  >
                    <Typography color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOn sx={{ mr: 1 }} /> Map view would appear here
                    </Typography>
                  </Box>
                  
                  <FindPharmacyButton
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<Store />}
                    component={motion.button}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Find Nearby Pharmacies
                  </FindPharmacyButton>
                </StyledPaper>
              </motion.div>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default GenericMedicineDetailPage; 