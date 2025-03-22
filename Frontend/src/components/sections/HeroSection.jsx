import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  useMediaQuery,
} from '@mui/material';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const HeroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box 
      component="section" 
      sx={{ 
        pt: { xs: 10, md: 12 },
        pb: { xs: 10, md: 14 },
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'transparent' // Completely transparent
      }}
    >
      <Container>
        <Grid container spacing={4} alignItems="center">
          {/* Text Content */}
          <Grid 
            item 
            xs={12} 
            md={7} 
            sx={{ 
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            <Box 
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)', // Very light background
                backdropFilter: 'blur(2px)', // Light blur effect
                borderRadius: '12px',
                p: { xs: 3, md: 4 },
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Typography 
                  variant="h2" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 700,
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                    mb: 3,
                    color: theme.palette.primary.dark,
                    lineHeight: 1.2,
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  Scan your prescription and save up to{' '}
                  <Box component="span" sx={{ color: theme.palette.primary.main }}>
                    70%
                  </Box>{' '}
                  on your medicines.
                </Typography>

                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 4,
                    fontWeight: 400,
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    maxWidth: { md: '90%' },
                    color: '#333',
                  }}
                >
                  MedGenix helps you find trusted generic alternatives to your prescribed medications at a fraction of the cost.
                </Typography>

                <Box sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  flexWrap: 'wrap',
                  justifyContent: { xs: 'center', md: 'flex-start' } 
                }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="large"
                    startIcon={<DocumentScannerIcon />}
                    sx={{ 
                      px: 3,
                      py: 1.5,
                      fontWeight: 600,
                      borderRadius: '8px',
                      boxShadow: '0 4px 14px rgba(0, 128, 128, 0.4)',
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(0, 128, 128, 0.5)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Scan Prescription
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="primary"
                    size="large" 
                    startIcon={<InfoOutlinedIcon />}
                    sx={{
                      px: 3,
                      py: 1.5,
                      fontWeight: 600,
                      borderRadius: '8px',
                      borderWidth: '2px',
                      backgroundColor: 'rgba(255, 255, 255, 0.4)',
                      '&:hover': {
                        borderWidth: '2px',
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                      },
                    }}
                  >
                    Learn More
                  </Button>
                </Box>
              </motion.div>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;
