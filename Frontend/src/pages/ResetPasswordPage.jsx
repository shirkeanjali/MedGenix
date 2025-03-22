import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  Button, 
  Grid, 
  Link, 
  InputAdornment, 
  IconButton, 
  Divider,
  OutlinedInput,
  FormControl,
  InputLabel,
  FormHelperText,
  CircularProgress,
  Avatar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Visibility, 
  VisibilityOff, 
  Lock,
  MedicalServices,
  KeyboardBackspace,
  CheckCircle
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

const ResetPasswordPage = () => {
  // State management
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const navigate = useNavigate();
  
  // Form values
  const [formValues, setFormValues] = useState({
    password: '',
    confirmPassword: ''
  });
  
  // Form errors
  const [formErrors, setFormErrors] = useState({
    password: '',
    confirmPassword: ''
  });

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
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
    
    // Clear errors when typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };

  const handleBack = () => {
    navigate('/otp-verification');
  };

  const handleResetPassword = (event) => {
    event.preventDefault();
    
    // Validate form
    let isValid = true;
    const errors = {};
    
    if (!formValues.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (formValues.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
      isValid = false;
    }
    
    if (!formValues.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formValues.password !== formValues.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
    if (!isValid) {
      setFormErrors(errors);
      return;
    }
    
    setLoading(true);
    
    // Simulate password reset
    setTimeout(() => {
      setLoading(false);
      setPasswordReset(true);
      
      // Clear session storage
      sessionStorage.removeItem('resetEmail');
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
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
            <StyledPaper component="form" onSubmit={handleResetPassword}>
              {!passwordReset ? (
                <>
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
                    Reset Password
                  </Typography>

                  <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                      Step 3 of 3: Create New Password
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
                        width: '100%', 
                        backgroundColor: 'primary.main',
                        borderRadius: '2px'
                      }} />
                    </Box>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        Create a new password for your account with email {email && `${email}`}.
                      </Typography>
                      <FormControl fullWidth variant="outlined" error={!!formErrors.password} sx={{ mb: 2 }}>
                        <InputLabel htmlFor="password">New Password</InputLabel>
                        <OutlinedInput
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          value={formValues.password}
                          onChange={handleFormChange}
                          startAdornment={
                            <InputAdornment position="start">
                              <Lock color="primary" />
                            </InputAdornment>
                          }
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={togglePasswordVisibility}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          }
                          label="New Password"
                        />
                        {formErrors.password && (
                          <FormHelperText>{formErrors.password}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth variant="outlined" error={!!formErrors.confirmPassword}>
                        <InputLabel htmlFor="confirmPassword">Confirm New Password</InputLabel>
                        <OutlinedInput
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formValues.confirmPassword}
                          onChange={handleFormChange}
                          startAdornment={
                            <InputAdornment position="start">
                              <Lock color="primary" />
                            </InputAdornment>
                          }
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle confirm password visibility"
                                onClick={toggleConfirmPasswordVisibility}
                                edge="end"
                              >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          }
                          label="Confirm New Password"
                        />
                        {formErrors.confirmPassword && (
                          <FormHelperText>{formErrors.confirmPassword}</FormHelperText>
                        )}
                      </FormControl>
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
                      {loading ? 'Resetting Password...' : 'Reset Password'}
                    </ActionButton>
                  </Box>
                </>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CheckCircle color="success" sx={{ fontSize: 60, mb: 2 }} />
                  <Typography variant="h5" gutterBottom>
                    Password Reset Successful!
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Your password has been successfully reset. You will be redirected to the login page in a few seconds.
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary"
                    component={RouterLink}
                    to="/login"
                  >
                    Go to Login
                  </Button>
                </Box>
              )}

              {!passwordReset && (
                <>
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
                </>
              )}
            </StyledPaper>
          </motion.div>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default ResetPasswordPage; 