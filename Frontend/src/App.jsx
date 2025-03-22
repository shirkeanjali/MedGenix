import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import HeroSection from './components/sections/HeroSection';
import FeaturesSection from './components/sections/FeaturesSection';
import Footer from './components/layout/Footer';
import SplineBackground from './components/ui/SplineBackground';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import OtpVerificationPage from './pages/OtpVerificationPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// Create a theme with teal as the primary color
const theme = createTheme({
  palette: {
    primary: {
      main: '#008080', // Teal color as requested
      dark: '#006666',
      light: '#00a0a0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#f8f9fa',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
        },
        containedPrimary: {
          boxShadow: '0 4px 14px rgba(0, 128, 128, 0.4)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(0, 128, 128, 0.5)',
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '24px',
          paddingRight: '24px',
          '@media (min-width: 600px)': {
            paddingLeft: '32px',
            paddingRight: '32px',
          },
        },
        maxWidthLg: {
          '@media (min-width: 1200px)': {
            maxWidth: '1200px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
        },
      },
    },
  },
});

// Home Page Component
const HomePage = () => {
  return (
    <>
      {/* 3D Spline background limited to hero section height */}
      <SplineBackground />
      
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, position: 'relative', zIndex: 1 }}>
        {/* Hero Section */}
        <HeroSection />
        
        {/* Content after hero section - with white background */}
        <Box sx={{ 
          position: 'relative',
          backgroundColor: '#ffffff',
          boxShadow: '0px -10px 20px rgba(0, 0, 0, 0.05)',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          mt: -4, // Pull up slightly to create overlap
          pb: 4,
          zIndex: 2, // Ensure this is above the SplineBackground
        }}>
          {/* Features Section */}
          <FeaturesSection />
        </Box>
      </Box>
      
      {/* Footer */}
      <Footer />
    </>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh', 
          position: 'relative',
          overflowX: 'hidden',
        }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<EmailVerificationPage />} />
            <Route path="/otp-verification" element={<OtpVerificationPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Routes>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;