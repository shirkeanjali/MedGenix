import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import HeroSection from './components/sections/HeroSection';
import FeaturesSection from './components/sections/FeaturesSection';
import Footer from './components/layout/Footer';
import VideoBackground from './components/ui/VideoBackground';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import OtpVerificationPage from './pages/OtpVerificationPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { LoadingProvider } from './context/LoadingContext';
import ProtectedRoute from './components/ProtectedRoute';
import EmailVerifyPage from './pages/EmailVerifyPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import MedicineDetailPage from './pages/MedicineDetailPage';
import GenericMedicineDetailPage from './pages/GenericMedicineDetailPage';
import PharmacyLocatePage from './pages/PharmacyLocatePage';
import HowItWorksPage from './pages/HowItWorksPage';
import FAQPage from './pages/FAQPage';
import PrescriptionUploadPage from './pages/FileUploadPage';
import PrescriptionDetailPage from './pages/PrescriptionDetailPage';
import GenericAlternativesPage from './pages/GenericAlternativesPage';
import MedicineComparisonPage from './pages/MedicineComparisonPage';
import ChemistDashboard from './pages/ChemistDashboard';
import AnimationTestPage from './pages/AnimationTestPage';
import PrescriptionGuidePage from './pages/PrescriptionGuidePage';
import AboutUsPage from './pages/AboutUsPage';
// Create a theme with teal as the primary color
const theme = createTheme({
  palette: {
    primary: {
      main: '#008080', // Teal color
      light: '#67c27c', // Light green from the gradient
      dark: '#006666', // Darker teal
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#67c27c', // Light green from the gradient
      light: '#8bd99e',
      dark: '#4a9d5d',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#f8f9fa',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
    success: {
      main: '#67c27c', // Light green for success states
      light: '#8bd99e',
      dark: '#4a9d5d',
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
       
        outlinedPrimary: {
          borderColor: '#008080',
          color: '#008080',
          '&:hover': {
            borderColor: '#67c27c',
            backgroundColor: 'rgba(103, 194, 124, 0.08)',
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
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

// Home Page Component
const HomePage = () => {
  return (
    <>
      {/* Video background for hero section */}
      <VideoBackground />
      
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, position: 'relative', zIndex: 1 }}>
        {/* Hero Section */}
        <HeroSection />
        
        {/* Content after hero section */}
        <Box sx={{ 
          position: 'relative',
          backgroundColor: 'transparent',
          zIndex: 2,
          mt: 0, // Reset margin to 0 since we're controlling spacing in the Features component
          pt: 0,
          borderTop: 'none',
          overflow: 'visible',
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
      <AuthProvider>
        <LanguageProvider>
          <BrowserRouter>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              minHeight: '100vh', 
              position: 'relative',
              overflowX: 'hidden',
            }}>
              <Routes>
                {/* Dashboard is rendered without LoadingProvider */}
                <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                
                {/* All other routes are wrapped in LoadingProvider */}
                <Route path="/" element={
                  <LoadingProvider>
                    <HomePage />
                  </LoadingProvider>
                } />
                <Route path="/chemist-dashboard" element={
                  <LoadingProvider>
                    <ProtectedRoute><ChemistDashboard /></ProtectedRoute>
                  </LoadingProvider>
                } />
                <Route path="/signup" element={
                  <LoadingProvider>
                    <SignUpPage />
                  </LoadingProvider>
                } />
                <Route path="/login" element={
                  <LoadingProvider>
                    <LoginPage />
                  </LoadingProvider>
                } />
                <Route path="/verify-email" element={
                  <LoadingProvider>
                    <ProtectedRoute><EmailVerifyPage /></ProtectedRoute>
                  </LoadingProvider>
                } />
                <Route path="/forgot-password" element={
                  <LoadingProvider>
                    <ProtectedRoute><ForgotPasswordPage /></ProtectedRoute>
                  </LoadingProvider>
                } />
                <Route path="/otp-verification" element={
                  <LoadingProvider>
                    <ProtectedRoute><OtpVerificationPage /></ProtectedRoute>
                  </LoadingProvider>
                } />
                <Route path="/reset-password" element={
                  <LoadingProvider>
                    <ProtectedRoute><ResetPasswordPage /></ProtectedRoute>
                  </LoadingProvider>
                } />
                <Route path="/medicine/:id" element={
                  <LoadingProvider>
                    <ProtectedRoute><MedicineDetailPage /></ProtectedRoute>
                  </LoadingProvider>
                } />
                <Route path="/generic/medicine/:id" element={
                  <LoadingProvider>
                    <ProtectedRoute><GenericMedicineDetailPage /></ProtectedRoute>
                  </LoadingProvider>
                } />
                <Route path="/pharmacy-locate" element={
                  <LoadingProvider>
                    <ProtectedRoute><PharmacyLocatePage /></ProtectedRoute>
                  </LoadingProvider>
                } />
                <Route path="/how-it-works" element={
                  <LoadingProvider>
                    <HowItWorksPage />
                  </LoadingProvider>
                } />
                <Route path="/faq" element={
                  <LoadingProvider>
                    <FAQPage />
                  </LoadingProvider>
                } />
                <Route path="/file-upload" element={
                  <LoadingProvider>
                    <ProtectedRoute><PrescriptionUploadPage /></ProtectedRoute>
                  </LoadingProvider>
                } />
                <Route path="/prescription/:id" element={
                  <LoadingProvider>
                    <ProtectedRoute><PrescriptionDetailPage /></ProtectedRoute>
                  </LoadingProvider>
                } />
                <Route path="/generic-alternatives" element={
                  <LoadingProvider>
                    <ProtectedRoute><GenericAlternativesPage /></ProtectedRoute>
                  </LoadingProvider>
                } />
                <Route path="/compare-medicines" element={
                  <LoadingProvider>
                    <ProtectedRoute><MedicineComparisonPage /></ProtectedRoute>
                  </LoadingProvider>
                } />
                <Route path="/test-animation" element={
                  <LoadingProvider>
                    <AnimationTestPage />
                  </LoadingProvider>
                } />
                <Route path="/prescription-guide" element={
                  <LoadingProvider>
                    <PrescriptionGuidePage />
                  </LoadingProvider>
                } />
                <Route path="/about-us" element={
                  <LoadingProvider>
                    <AboutUsPage />
                  </LoadingProvider>
                } />
              </Routes>
            </Box>
          </BrowserRouter>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;