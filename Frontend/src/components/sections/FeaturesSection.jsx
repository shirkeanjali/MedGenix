import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  useMediaQuery,
  Divider,
  Paper
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';

// Import feature icons
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined';
import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';

// Feature section background
const featureBackgroundImg = 'https://img.freepik.com/free-photo/closeup-doctor-checking-blood-sample-with-microscope_23-2149008907.jpg';

const features = [
  {
    title: 'Read Your Prescription',
    description: 'Smart OCR technology reads and processes your prescription accurately',
    icon: <DescriptionOutlinedIcon fontSize="large" color="primary" />,
  },
  {
    title: 'Chat Bot',
    description: 'AI medical assistant answers all your medication-related questions',
    icon: <ChatOutlinedIcon fontSize="large" color="primary" />,
  },
  {
    title: 'Nearby Generic Pharmacies',
    description: 'Find local pharmacies with your medications in stock',
    icon: <LocationOnOutlinedIcon fontSize="large" color="primary" />,
  },
  {
    title: 'Availability Checker',
    description: 'Real-time stock checker for medications at partner pharmacies',
    icon: <InventoryOutlinedIcon fontSize="large" color="primary" />,
  },
  {
    title: 'Medicine Details',
    description: 'Comprehensive information on content, alternatives, brands, and prices',
    icon: <MedicationOutlinedIcon fontSize="large" color="primary" />,
  },
  {
    title: 'Language Support',
    description: 'Multi-language accessibility for diverse user needs',
    icon: <TranslateOutlinedIcon fontSize="large" color="primary" />,
  },
  {
    title: 'Prescription History',
    description: 'Track your prescription history and view potential savings',
    icon: <HistoryOutlinedIcon fontSize="large" color="primary" />,
  },
];

const FeaturesSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        position: 'relative',
        zIndex: 1,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${featureBackgroundImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.15,
          zIndex: -1,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(249,249,249,0.98) 100%)',
          zIndex: -1,
        }
      }}
    >
      <Container>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            textAlign: 'center', 
            mb: 8, 
            borderRadius: '16px',
            backgroundColor: 'rgba(255,255,255,0.8)', 
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            border: '1px solid rgba(0, 128, 128, 0.1)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h6"
              component="p"
              color="primary"
              sx={{ fontWeight: 600, mb: 1 }}
            >
              POWERFUL FEATURES
            </Typography>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.8rem' },
                color: theme.palette.primary.dark,
              }}
            >
              Everything You Need
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                maxWidth: '700px',
                mx: 'auto',
                mb: 2,
                fontSize: { xs: '1rem', md: '1.1rem' },
              }}
            >
              MedGenix provides a comprehensive set of tools to help you save on prescriptions and find affordable medication alternatives.
            </Typography>
            <Divider sx={{ width: '60px', mx: 'auto', borderColor: 'primary.main', borderWidth: 2, my: 3 }} />
          </motion.div>
        </Paper>

        <Grid container spacing={isMobile ? 2 : 3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: 'flex' }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{ width: '100%' }}
              >
                <Card
                  elevation={1}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.07)',
                      transform: 'translateY(-5px)',
                      borderColor: 'rgba(0, 128, 128, 0.2)',
                    },
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(5px)',
                  }}
                >
                  <CardContent 
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      p: 3,
                      flexGrow: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        width: '70px',
                        height: '70px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(0, 128, 128, 0.1)',
                        boxShadow: '0 4px 8px rgba(0, 128, 128, 0.1)',
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        color: theme.palette.primary.dark,
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection;
