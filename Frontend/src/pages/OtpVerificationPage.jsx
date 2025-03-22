import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Link, 
  Divider,
  CircularProgress,
  Avatar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  MedicalServices,
  KeyboardBackspace
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

const OtpVerificationPage = () => {
  // State management
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();
  
  // Form values
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Get email from session storage
    const storedEmail = sessionStorage.getItem('resetEmail');
    if (!storedEmail) {
      // Redirect to email verification page if email is not in session storage
      navigate('/forgot-password');
      return;
    }
    setEmail(storedEmail);
  }, [navigate]);

  // Event handlers
  const handleOtpChange = (event) => {
    // Only allow numeric input
    const value = event.target.value.replace(/\D/g, '');
    // Limit to 6 digits
    setOtp(value.slice(0, 6));
    if (otpError) setOtpError('');
  };

  const handleVerifyOTP = (event) => {
    event.preventDefault();
    
    if (!otp.trim()) {
      setOtpError('OTP is required');
      return;
    } else if (otp.length !== 6) {
      setOtpError('OTP must be 6 digits');
      return;
    }
    
    setLoading(true);
    
    // Simulate OTP verification
    setTimeout(() => {
      setLoading(false);
      // Navigate to reset password page
      navigate('/reset-password');
    }, 1500);
  };

  const handleResendOTP = () => {
    setResending(true);
    
    // Simulate OTP resending
    setTimeout(() => {
      setResending(false);
    }, 1500);
  };

  const handleBack = () => {
    navigate('/forgot-password');
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
            <StyledPaper component="form" onSubmit={handleVerifyOTP}>
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
                Verify OTP
              </Typography>

              <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                  Step 2 of 3: OTP Verification
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
                    width: '66.66%', 
                    backgroundColor: 'primary.main',
                    borderRadius: '2px'
                  }} />
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Enter the 6-digit verification code sent to your email address {email && `(${email})`}.
                  </Typography>
                  <TextField
                    fullWidth
                    name="otp"
                    label="Verification Code"
                    variant="outlined"
                    type="text"
                    inputMode="numeric"
                    value={otp}
                    onChange={handleOtpChange}
                    error={!!otpError}
                    helperText={otpError}
                    placeholder="Enter 6-digit code"
                    inputProps={{ maxLength: 6 }}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      color="secondary"
                      size="small"
                      onClick={handleResendOTP}
                      disabled={resending}
                      sx={{
                        textTransform: 'none',
                        fontSize: '0.9rem'
                      }}
                    >
                      {resending ? (
                        <>
                          <CircularProgress size={16} sx={{ mr: 1 }} />
                          Resending...
                        </>
                      ) : 'Resend Code'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                  startIcon={<KeyboardBackspace />}
                  onClick={handleBack}
                  sx={{ textTransform: 'none' }}
                >
                  Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                <ActionButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  startIcon={loading && <CircularProgress size={20} color="inherit" />}
                >
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </ActionButton>
              </Box>

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

export default OtpVerificationPage; 