import { useState } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Link, 
  InputAdornment, 
  Divider,
  CircularProgress,
  Avatar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Email, 
  MedicalServices
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(8px)',
  background: 'rgba(255, 255, 255, 0.9)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(6),
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(3),
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

const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(3, 0),
  '&::before, &::after': {
    borderColor: 'rgba(0, 128, 128, 0.2)',
  },
}));

const EmailVerificationPage = () => {
  // State management
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Form values
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  // Event handlers
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    if (emailError) setEmailError('');
  };

  const handleSendOTP = (event) => {
    event.preventDefault();
    
    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid');
      return;
    }
    
    setLoading(true);
    
    // Simulate OTP sending
    setTimeout(() => {
      setLoading(false);
      // Store email in sessionStorage to use in next steps
      sessionStorage.setItem('resetEmail', email);
      // Navigate to OTP verification page
      navigate('/otp-verification');
    }, 1500);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #006666 0%, #008080 50%, #00a0a0 100%)',
      }}
    >
      <Header />
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: { xs: 4, md: 8 },
        }}
      >
        <Container maxWidth="sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StyledPaper component="form" onSubmit={handleSendOTP}>
              <Typography
                variant="h5"
                component="h2"
                align="center"
                gutterBottom
                sx={{ 
                  fontWeight: 600, 
                  color: 'primary.dark',
                  mb: 3
                }}
              >
                Forgot Password
              </Typography>

              <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                  Step 1 of 3: Email Verification
                </Typography>
                <Box sx={{ 
                  width: '100%', 
                  display: 'flex', 
                  position: 'relative',
                  height: '4px',
                  backgroundColor: 'rgba(0, 128, 128, 0.1)',
                  borderRadius: '2px',
                  mb: 3
                }}>
                  <Box sx={{ 
                    width: '33.33%', 
                    backgroundColor: 'primary.main',
                    borderRadius: '2px'
                  }} />
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Enter your registered email address. We will send a verification code to this email.
                  </Typography>
                  <TextField
                    fullWidth
                    name="email"
                    label="Email Address"
                    variant="outlined"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    error={!!emailError}
                    helperText={emailError}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <ActionButton
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} color="inherit" />}
              >
                {loading ? 'Sending Verification Code...' : 'Send Verification Code'}
              </ActionButton>

              <StyledDivider>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </StyledDivider>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Remember your password?{' '}
                  <Link 
                    component={RouterLink}
                    to="/login"
                    underline="hover"
                    sx={{ 
                      fontWeight: 600,
                      color: 'primary.main',
                      '&:hover': {
                        color: 'primary.dark'
                      }
                    }}
                  >
                    Log In
                  </Link>
                </Typography>
              </Box>
            </StyledPaper>
          </motion.div>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default EmailVerificationPage; 