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
  Avatar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Visibility, 
  VisibilityOff, 
  Email, 
  Phone, 
  Lock, 
  Person,
  MedicalServices
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';

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

const SignUpButton = styled(Button)(({ theme }) => ({
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

const SignUpPage = () => {
  // State management
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  
  // Form values
  const [formValues, setFormValues] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });
  
  // Form errors
  const [formErrors, setFormErrors] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });

  // Event handlers
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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

  const handleSendOTP = () => {
    if (!formValues.phone) {
      setFormErrors({
        ...formErrors,
        phone: 'Phone number is required',
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
    
    // Validate name
    if (!formValues.fullName.trim()) {
      errors.fullName = 'Full name is required';
      isValid = false;
    }
    
    // Validate email if using email tab
    if (tabValue === 0) {
      if (!formValues.email.trim()) {
        errors.email = 'Email is required';
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
        errors.email = 'Email is invalid';
        isValid = false;
      }
    }
    
    // Validate phone if using phone tab
    if (tabValue === 1) {
      if (!formValues.phone.trim()) {
        errors.phone = 'Phone number is required';
        isValid = false;
      } else if (!/^\d{10}$/.test(formValues.phone.replace(/\D/g, ''))) {
        errors.phone = 'Please enter a valid 10-digit phone number';
        isValid = false;
      }
      
      if (otpSent && !formValues.otp.trim()) {
        errors.otp = 'OTP is required';
        isValid = false;
      }
    }
    
    // Validate password
    if (!formValues.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (formValues.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
      isValid = false;
    }
    
    // Validate confirm password
    if (!formValues.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formValues.password !== formValues.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      
      // Simulate form submission
      setTimeout(() => {
        setLoading(false);
        // Handle successful registration (redirect to login or dashboard)
        console.log('Form submitted:', formValues);
      }, 2000);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 4, md: 8 },
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #006666 0%, #008080 50%, #00a0a0 100%)',
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              mb: 4
            }}
          >
            <Avatar
              sx={{
                bgcolor: 'white',
                width: 70,
                height: 70,
                mb: 2,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
            >
              <MedicalServices sx={{ color: 'primary.main', fontSize: 36 }} />
            </Avatar>
            <Typography
              variant="h4"
              component={RouterLink}
              to="/"
              sx={{
                fontWeight: 700,
                color: 'white',
                textAlign: 'center',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                textDecoration: 'none'
              }}
            >
              MedGenix
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                textAlign: 'center',
                mb: 1,
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
              }}
            >
              Where Health Meets Affordability
            </Typography>
            
            <Button
              component={RouterLink}
              to="/"
              variant="outlined"
              size="small"
              sx={{
                mt: 2,
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.5)',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Back to Home
            </Button>
          </Box>

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
              Create Your MedGenix Account
            </Typography>

            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
              aria-label="sign up method tabs"
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
                label="Email" 
                icon={<Email />} 
                iconPosition="start" 
              />
              <Tab 
                label="Phone Number" 
                icon={<Phone />} 
                iconPosition="start" 
              />
            </Tabs>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="fullName"
                  label="Full Name"
                  variant="outlined"
                  value={formValues.fullName}
                  onChange={handleFormChange}
                  error={!!formErrors.fullName}
                  helperText={formErrors.fullName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {tabValue === 0 && (
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
              )}

              {tabValue === 1 && (
                <>
                  <Grid item xs={12}>
                    <Grid container spacing={1}>
                      <Grid item xs={otpSent ? 8 : 12}>
                        <TextField
                          fullWidth
                          name="phone"
                          label="Phone Number"
                          variant="outlined"
                          value={formValues.phone}
                          onChange={handleFormChange}
                          error={!!formErrors.phone}
                          helperText={formErrors.phone}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Phone color="primary" />
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
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="otp"
                        label="Enter OTP"
                        variant="outlined"
                        value={formValues.otp}
                        onChange={handleFormChange}
                        error={!!formErrors.otp}
                        helperText={formErrors.otp || "OTP sent to your phone number"}
                        sx={{ mt: 1 }}
                      />
                    </Grid>
                  )}
                </>
              )}

              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined" error={!!formErrors.password}>
                  <InputLabel htmlFor="password">Create Password</InputLabel>
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
                    label="Create Password"
                  />
                  {formErrors.password && (
                    <FormHelperText>{formErrors.password}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined" error={!!formErrors.confirmPassword}>
                  <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
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
                    label="Confirm Password"
                  />
                  {formErrors.confirmPassword && (
                    <FormHelperText>{formErrors.confirmPassword}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sx={{ textAlign: 'right' }}>
                <Link 
                  href="#" 
                  underline="hover"
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

            <SignUpButton
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </SignUpButton>

            <StyledDivider>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </StyledDivider>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
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
  );
};

export default SignUpPage; 