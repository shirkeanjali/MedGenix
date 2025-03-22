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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form values
  const [formValues, setFormValues] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  
  // Form errors
  const [formErrors, setFormErrors] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

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

  const validateForm = () => {
    let isValid = true;
    const errors = {};
    
    // Validate name
    if (!formValues.fullName.trim()) {
      errors.fullName = 'Full name is required';
      isValid = false;
    }
    
    // Validate email
    if (!formValues.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }
    
    // Validate phone (optional)
    if (formValues.phone.trim() && !/^\d{10}$/.test(formValues.phone.replace(/\D/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit phone number';
      isValid = false;
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
                Create Your MedGenix Account
              </Typography>

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
                  <TextField
                    fullWidth
                    name="phone"
                    label="Phone Number (Optional)"
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
      <Footer />
    </Box>
  );
};

export default SignUpPage; 