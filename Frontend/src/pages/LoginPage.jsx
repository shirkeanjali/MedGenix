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
  IconButton, 
  Tabs,
  Tab,
  Divider,
  OutlinedInput,
  FormControl,
  InputLabel,
  FormHelperText,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Avatar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Visibility, 
  VisibilityOff, 
  Email, 
  Phone, 
  Lock,
  MedicalServices
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
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

const LoginButton = styled(Button)(({ theme }) => ({
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

const LoginPage = () => {
  // State management
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [contactType, setContactType] = useState('email');
  
  // Form values
  const [formValues, setFormValues] = useState({
    email: '',
    phone: '',
    password: '',
    otp: '',
    rememberMe: false,
    contactInfo: ''
  });
  
  // Form errors
  const [formErrors, setFormErrors] = useState({
    email: '',
    phone: '',
    password: '',
    otp: '',
    contactInfo: ''
  });

  // Event handlers
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setOtpSent(false);
  };

  const handleContactTypeChange = (event, newType) => {
    if (newType !== null) {
      setContactType(newType);
      setFormValues({
        ...formValues,
        contactInfo: ''
      });
      setFormErrors({
        ...formErrors,
        contactInfo: ''
      });
      setOtpSent(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleFormChange = (event) => {
    const { name, value, checked } = event.target;
    setFormValues({
      ...formValues,
      [name]: name === 'rememberMe' ? checked : value,
    });
    
    // Clear errors when typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };

  const handleSendOTP = () => {
    if (!formValues.contactInfo) {
      setFormErrors({
        ...formErrors,
        contactInfo: `${contactType === 'email' ? 'Email' : 'Phone number'} is required`,
      });
      return;
    }

    // Validate contact info
    if (contactType === 'email' && !/\S+@\S+\.\S+/.test(formValues.contactInfo)) {
      setFormErrors({
        ...formErrors,
        contactInfo: 'Email is invalid',
      });
      return;
    } else if (contactType === 'phone' && !/^\d{10}$/.test(formValues.contactInfo.replace(/\D/g, ''))) {
      setFormErrors({
        ...formErrors,
        contactInfo: 'Please enter a valid 10-digit phone number',
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate OTP sending
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
    }, 1500);
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {};
    
    // Validate for password login
    if (tabValue === 0) {
      if (!formValues.email.trim()) {
        errors.email = 'Email is required';
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
        errors.email = 'Email is invalid';
        isValid = false;
      }
      
      if (!formValues.password) {
        errors.password = 'Password is required';
        isValid = false;
      }
    }
    
    // Validate for OTP login
    if (tabValue === 1) {
      if (!formValues.contactInfo.trim()) {
        errors.contactInfo = `${contactType === 'email' ? 'Email' : 'Phone number'} is required`;
        isValid = false;
      } else if (contactType === 'email' && !/\S+@\S+\.\S+/.test(formValues.contactInfo)) {
        errors.contactInfo = 'Email is invalid';
        isValid = false;
      } else if (contactType === 'phone' && !/^\d{10}$/.test(formValues.contactInfo.replace(/\D/g, ''))) {
        errors.contactInfo = 'Please enter a valid 10-digit phone number';
        isValid = false;
      }
      
      if (otpSent && !formValues.otp.trim()) {
        errors.otp = 'OTP is required';
        isValid = false;
      }
    }
    
    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      
      // Prepare the data for submission based on login method
      const loginData = {
        method: tabValue === 0 ? 'password' : 'otp',
        rememberMe: formValues.rememberMe
      };

      if (tabValue === 0) {
        // Password login data
        loginData.email = formValues.email;
        loginData.password = formValues.password;
      } else {
        // OTP login data
        loginData.contactType = contactType;
        loginData.contactInfo = formValues.contactInfo;
        loginData.otp = formValues.otp;
      }
      
      // Simulate form submission
      setTimeout(() => {
        setLoading(false);
        // Handle successful login (redirect to dashboard)
        console.log('Form submitted:', loginData);
      }, 2000);
    }
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
            <StyledPaper component="form" onSubmit={handleSubmit}>
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
                Welcome Back to MedGenix
              </Typography>

              <Typography
                variant="body1"
                align="center"
                sx={{ 
                  color: 'text.secondary',
                  mb: 3
                }}
              >
                Choose your preferred login method
              </Typography>

              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
                indicatorColor="primary"
                textColor="primary"
                aria-label="login method tabs"
                sx={{ 
                  mb: 3,
                  '& .MuiTab-root': {
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    textTransform: 'none',
                  },
                  borderBottom: 1,
                  borderColor: 'divider' 
                }}
              >
                <Tab 
                  label="Password Login" 
                  icon={<Lock />} 
                  iconPosition="start" 
                />
                <Tab 
                  label="OTP Login" 
                  icon={<Email />} 
                  iconPosition="start" 
                />
              </Tabs>

              <Grid container spacing={2}>
                {tabValue === 0 && (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="email"
                        label="Email Address"
                        variant="outlined"
                        type="email"
                        value={formValues.email}
                        onChange={handleFormChange}
                        error={!!formErrors.email}
                        helperText={formErrors.email}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <FormControl fullWidth variant="outlined" error={!!formErrors.password}>
                        <InputLabel htmlFor="password">Password</InputLabel>
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
                          label="Password"
                        />
                        {formErrors.password && (
                          <FormHelperText>{formErrors.password}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  </>
                )}

                {tabValue === 1 && (
                  <>
                    <Grid item xs={12}>
                      <Tabs
                        value={contactType}
                        onChange={handleContactTypeChange}
                        variant="fullWidth"
                        indicatorColor="secondary"
                        textColor="primary"
                        aria-label="contact type tabs"
                        sx={{ 
                          mb: 2,
                          '& .MuiTab-root': {
                            fontSize: '0.85rem',
                            color: 'rgba(0, 0, 0, 0.7)',
                          },
                          '& .Mui-selected': {
                            color: 'primary.main',
                            fontWeight: 'bold',
                          }
                        }}
                      >
                        <Tab value="email" label="Email" icon={<Email fontSize="small" />} iconPosition="start" />
                        <Tab value="phone" label="Phone" icon={<Phone fontSize="small" />} iconPosition="start" />
                      </Tabs>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container spacing={1}>
                        <Grid item xs={otpSent ? 8 : 12}>
                          <TextField
                            fullWidth
                            name="contactInfo"
                            label={contactType === 'email' ? "Email Address" : "Phone Number"}
                            variant="outlined"
                            type={contactType === 'email' ? "email" : "tel"}
                            value={formValues.contactInfo}
                            onChange={handleFormChange}
                            error={!!formErrors.contactInfo}
                            helperText={formErrors.contactInfo}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  {contactType === 'email' ? <Email color="primary" /> : <Phone color="primary" />}
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        {!otpSent && (
                          <Grid item xs={4}>
                            <Button
                              fullWidth
                              variant="outlined"
                              color="primary"
                              onClick={handleSendOTP}
                              disabled={loading}
                              sx={{ 
                                height: '56px',
                                textTransform: 'none'
                              }}
                            >
                              {loading ? <CircularProgress size={24} /> : 'Send OTP'}
                            </Button>
                          </Grid>
                        )}
                      </Grid>
                    </Grid>

                    {otpSent && (
                      <>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            name="otp"
                            label="Enter OTP"
                            variant="outlined"
                            value={formValues.otp}
                            onChange={handleFormChange}
                            error={!!formErrors.otp}
                            helperText={formErrors.otp || `OTP sent to your ${contactType === 'email' ? 'email address' : 'phone number'}`}
                            sx={{ mt: 1 }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                              color="secondary"
                              size="small"
                              onClick={handleSendOTP}
                              disabled={loading}
                              sx={{
                                textTransform: 'none',
                                fontSize: '0.8rem'
                              }}
                            >
                              {loading ? <CircularProgress size={16} /> : 'Resend OTP'}
                            </Button>
                          </Box>
                        </Grid>
                      </>
                    )}
                  </>
                )}

                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={formValues.rememberMe} 
                        onChange={handleFormChange}
                        name="rememberMe"
                        color="primary"
                      />
                    }
                    label="Remember me"
                  />
                  
                  <Link 
                    href="#" 
                    underline="hover"
                    component={RouterLink}
                    to="/forgot-password"
                    sx={{ 
                      color: 'primary.main',
                      fontSize: '0.875rem',
                      '&:hover': {
                        color: 'primary.dark'
                      }
                    }}
                  >
                    Forgot Password?
                  </Link>
                </Grid>
              </Grid>

              <LoginButton
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} color="inherit" />}
              >
                {loading ? 'Logging in...' : 'Log In'}
              </LoginButton>

              <StyledDivider>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </StyledDivider>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Link 
                    component={RouterLink}
                    to="/signup"
                    underline="hover"
                    sx={{ 
                      fontWeight: 600,
                      color: 'primary.main',
                      '&:hover': {
                        color: 'primary.dark'
                      }
                    }}
                  >
                    Sign Up
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

export default LoginPage; 