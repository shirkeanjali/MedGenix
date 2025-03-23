import { useState, useEffect, useRef } from 'react';
import { Box, Container, Typography, Button, CircularProgress, Alert, Chip, Paper } from '@mui/material';
import { LocationOn, Refresh, LocalPharmacy, Check } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import usePageLoading from '../hooks/usePageLoading';

// Google Maps API key
const GOOGLE_MAPS_API_KEY = 'AIzaSyDHrONTX_PmQf0lT1_6rIZvnJ2zrpbQU40';

// Keywords that might indicate a generic pharmacy
const GENERIC_KEYWORDS = [
  'generic', 'affordable', 'discount', 'low cost', 'budget', 
  'cheap', 'inexpensive', 'economical', 'reasonable',
  'wholesale', 'bulk', 'public', 'government', 'subsidized'
];

// Simulated pharmacy data generator
const generatePharmacies = (userLocation) => {
  if (!userLocation) return [];
  
  const pharmacies = [
    {
      id: 'pharmacy-1',
      name: 'City Generic Pharmacy',
      vicinity: '123 Main St, Downtown',
      position: { 
        lat: userLocation.lat + 0.008, 
        lng: userLocation.lng + 0.005 
      },
      isGeneric: true,
      rating: 4.2,
      user_ratings_total: 156,
      formatted_phone_number: '+91 98765 43210',
      formatted_address: '123 Main St, Downtown Area, City Center',
      opening_hours: { isOpen: () => true },
      types: ['pharmacy', 'health', 'store'],
      photoUrl: 'https://images.unsplash.com/photo-1586015555751-63c29b8cd2eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80',
      website: 'https://example.com/city-generic'
    },
    {
      id: 'pharmacy-2',
      name: 'MedPlus Pharmacy',
      vicinity: '456 Oak Ave, Westside',
      position: { 
        lat: userLocation.lat - 0.006, 
        lng: userLocation.lng + 0.009 
      },
      isGeneric: false,
      rating: 4.7,
      user_ratings_total: 203,
      formatted_phone_number: '+91 98765 12345',
      formatted_address: '456 Oak Avenue, Westside District, City',
      opening_hours: { isOpen: () => true },
      types: ['pharmacy', 'store', 'health'],
      photoUrl: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80',
      website: 'https://example.com/medplus'
    },
    {
      id: 'pharmacy-3',
      name: 'Discount Medical Supplies',
      vicinity: '789 Pine Blvd, Eastside',
      position: { 
        lat: userLocation.lat + 0.012, 
        lng: userLocation.lng - 0.007 
      },
      isGeneric: true,
      rating: 3.9,
      user_ratings_total: 89,
      formatted_phone_number: '+91 98765 98765',
      formatted_address: '789 Pine Boulevard, Eastside Area, City',
      opening_hours: { isOpen: () => false },
      types: ['pharmacy', 'store', 'health'],
      photoUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80',
      website: 'https://example.com/discount-medical'
    },
    {
      id: 'pharmacy-4',
      name: 'Wellness Pharmacy',
      vicinity: '321 Elm St, Northside',
      position: { 
        lat: userLocation.lat - 0.009, 
        lng: userLocation.lng - 0.008 
      },
      isGeneric: false,
      rating: 4.5,
      user_ratings_total: 178,
      formatted_phone_number: '+91 98765 56789',
      formatted_address: '321 Elm Street, Northside District, City',
      opening_hours: { isOpen: () => true },
      types: ['pharmacy', 'health', 'store'],
      photoUrl: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80',
      website: 'https://example.com/wellness'
    },
    {
      id: 'pharmacy-5',
      name: 'Government Medical Store',
      vicinity: '555 Public Rd, Central District',
      position: { 
        lat: userLocation.lat + 0.003, 
        lng: userLocation.lng + 0.015 
      },
      isGeneric: true,
      rating: 3.5,
      user_ratings_total: 112,
      formatted_phone_number: '+91 98765 11111',
      formatted_address: '555 Public Road, Central District, City',
      opening_hours: { isOpen: () => true },
      types: ['pharmacy', 'health', 'government'],
      photoUrl: 'https://images.unsplash.com/photo-1583912267550-d6cc57ba3abb?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80',
      website: 'https://example.com/govt-medical'
    },
    {
      id: 'pharmacy-6',
      name: 'Apollo Pharmacy',
      vicinity: '777 Market St, Business District',
      position: { 
        lat: userLocation.lat - 0.015, 
        lng: userLocation.lng + 0.002 
      },
      isGeneric: false,
      rating: 4.8,
      user_ratings_total: 256,
      formatted_phone_number: '+91 98765 22222',
      formatted_address: '777 Market Street, Business District, City',
      opening_hours: { isOpen: () => true },
      types: ['pharmacy', 'health', 'store'],
      photoUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80',
      website: 'https://example.com/apollo'
    },
    {
      id: 'pharmacy-7',
      name: 'Affordable Meds',
      vicinity: '888 Economy Lane, Suburb',
      position: { 
        lat: userLocation.lat + 0.018, 
        lng: userLocation.lng - 0.012 
      },
      isGeneric: true,
      rating: 4.0,
      user_ratings_total: 67,
      formatted_phone_number: '+91 98765 33333',
      formatted_address: '888 Economy Lane, Suburban Area, City',
      opening_hours: { isOpen: () => true },
      types: ['pharmacy', 'health', 'store'],
      photoUrl: 'https://images.unsplash.com/photo-1583912267220-e1a2a5c4da52?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80',
      website: 'https://example.com/affordable-meds'
    },
    {
      id: 'pharmacy-8',
      name: 'Premium Health Center',
      vicinity: '999 Luxury Ave, Uptown',
      position: { 
        lat: userLocation.lat - 0.012, 
        lng: userLocation.lng - 0.018 
      },
      isGeneric: false,
      rating: 4.9,
      user_ratings_total: 312,
      formatted_phone_number: '+91 98765 44444',
      formatted_address: '999 Luxury Avenue, Uptown District, City',
      opening_hours: { isOpen: () => true },
      types: ['pharmacy', 'health', 'store'],
      photoUrl: 'https://images.unsplash.com/photo-1631549916768-4119b4123a21?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80',
      website: 'https://example.com/premium-health'
    }
  ];
  
  return pharmacies;
};

const PharmacyLocatePage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapStatus, setMapStatus] = useState('loading'); // 'loading', 'ready', 'error'
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [showGenericOnly, setShowGenericOnly] = useState(false);
  
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowRef = useRef(null);
  const apiLoadedRef = useRef(false);
  const mapInitializedRef = useRef(false);
  
  // Connect to the loading system
  usePageLoading(loading, 'pharmacy-locate-page');
  
  // Load Google Maps API once
  useEffect(() => {
    // If Google Maps is already loaded, just set the flag
    if (window.google?.maps) {
      apiLoadedRef.current = true;
      return;
    }
    
    // If we're already loading, don't load again
    if (window.isLoadingGoogleMaps) return;
    
    window.isLoadingGoogleMaps = true;
    
    // Create script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.defer = true;
    
    // Set up event handlers
    script.onload = () => {
      apiLoadedRef.current = true;
      window.isLoadingGoogleMaps = false;
      // Force a re-render
      setMapStatus(prev => prev === 'loading' ? 'loading-complete' : prev);
    };
    
    script.onerror = () => {
      console.error('Failed to load Google Maps API');
      setError('Failed to load Google Maps. Please refresh the page.');
      setMapStatus('error');
      setLoading(false);
      window.isLoadingGoogleMaps = false;
    };
    
    // Add the script to the document
    document.head.appendChild(script);
    
    // No cleanup needed for API loading
  }, []);
  
  // Get user location
  useEffect(() => {
    if (userLocation) return; // Already have location
    
    const getUserLocation = () => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by this browser.');
        setLoading(false);
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userPos);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to access your location. Please enable location services and try again.');
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    };
    
    getUserLocation();
  }, [userLocation]);
  
  // Generate simulated pharmacy data when user location changes
  useEffect(() => {
    if (!userLocation) return;
    
    // Generate simulated pharmacy data
    const simulatedPharmacies = generatePharmacies(userLocation);
    setPharmacies(simulatedPharmacies);
    setLoading(false);
  }, [userLocation]);
  
  // Initialize map when container is ready, API is loaded, and we have user location
  useEffect(() => {
    // Only proceed if we have all requirements
    if (!mapContainerRef.current || !userLocation || !window.google?.maps || mapInitializedRef.current) {
      return;
    }
    
    const initializeMap = () => {
      try {
        // Clean up any existing map instance
        if (mapInstanceRef.current) {
          // Clear markers
          if (markersRef.current.length > 0) {
            markersRef.current.forEach(marker => {
              if (marker) marker.setMap(null);
            });
            markersRef.current = [];
          }
        }
        
        // Create map
        const mapOptions = {
          center: userLocation,
          zoom: 14,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
          zoomControl: true,
        };
        
        // Create new map instance
        const map = new window.google.maps.Map(
          mapContainerRef.current,
          mapOptions
        );
        mapInstanceRef.current = map;
        
        // Create a single info window to reuse
        infoWindowRef.current = new window.google.maps.InfoWindow();
        
        // Add user marker
        const userMarker = new window.google.maps.Marker({
          position: userLocation,
          map: map,
          title: 'Your Location',
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#4285F4',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
          },
          zIndex: 1000, // Ensure user marker is on top
        });
        markersRef.current.push(userMarker);
        
        mapInitializedRef.current = true;
        setMapStatus('ready');
      } catch (error) {
        console.error('Error initializing map:', error);
        setError('Failed to initialize map. Please try again.');
        setMapStatus('error');
        setLoading(false);
      }
    };
    
    // Initialize map with a slight delay to ensure DOM is ready
    setTimeout(initializeMap, 100);
    
    // Cleanup function
    return () => {
      if (markersRef.current.length > 0) {
        markersRef.current.forEach(marker => {
          if (marker) marker.setMap(null);
        });
        markersRef.current = [];
      }
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
      mapInitializedRef.current = false;
    };
  }, [userLocation, mapStatus]);
  
  // Update markers when pharmacies change or filter changes
  useEffect(() => {
    if (!mapInstanceRef.current || !pharmacies.length) return;
    
    // Clear existing pharmacy markers (keep user marker)
    markersRef.current.slice(1).forEach(marker => {
      if (marker) marker.setMap(null);
    });
    markersRef.current = [markersRef.current[0]]; // Keep only user marker
    
    // Filter pharmacies based on showGenericOnly
    const filteredPharmacies = showGenericOnly 
      ? pharmacies.filter(pharmacy => pharmacy.isGeneric)
      : pharmacies;
    
    // Add pharmacy markers
    filteredPharmacies.forEach(pharmacy => {
      if (!pharmacy.position) return;
      
      // Create marker
      const marker = new window.google.maps.Marker({
        position: pharmacy.position,
        map: mapInstanceRef.current,
        title: pharmacy.name,
        animation: window.google.maps.Animation.DROP,
        icon: {
          url: pharmacy.isGeneric 
            ? 'https://maps.google.com/mapfiles/ms/icons/green-dot.png' 
            : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
          scaledSize: new window.google.maps.Size(32, 32),
        },
      });
      
      // Add click listener
      marker.addListener('click', () => {
        // Close any open info window
        if (infoWindowRef.current) {
          infoWindowRef.current.close();
        }
        
        // Update selected pharmacy
        setSelectedPharmacy(pharmacy);
        
        // Create info window content
        const content = `
          <div style="padding: 10px; max-width: 300px;">
            <h3 style="margin-top: 0; color: ${pharmacy.isGeneric ? '#2e7d32' : '#d32f2f'};">
              ${pharmacy.name} ${pharmacy.isGeneric ? '(Generic)' : ''}
            </h3>
            <p style="margin: 5px 0;">${pharmacy.vicinity || ''}</p>
            ${pharmacy.rating ? `<p style="margin: 5px 0;">Rating: ${pharmacy.rating} ⭐</p>` : ''}
            <p style="margin: 5px 0; font-size: 0.9em; color: #666;">Click for more details</p>
          </div>
        `;
        
        // Set info window content and open
        infoWindowRef.current.setContent(content);
        infoWindowRef.current.open(mapInstanceRef.current, marker);
        
        // Animate marker
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(window.google.maps.Animation.BOUNCE);
          setTimeout(() => {
            marker.setAnimation(null);
          }, 1500);
        }
      });
      
      markersRef.current.push(marker);
    });
    
  }, [pharmacies, showGenericOnly]);
  
  // Handle refresh to get new location
  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    setMapStatus('loading');
    setPharmacies([]);
    setSelectedPharmacy(null);
    mapInitializedRef.current = false;
    
    // Clear existing markers
    if (markersRef.current.length > 0) {
      markersRef.current.forEach(marker => {
        if (marker) marker.setMap(null);
      });
      markersRef.current = [];
    }
    
    // Get new location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userPos);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to access your location. Please enable location services and try again.');
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  };
  
  // Toggle generic only filter
  const toggleGenericFilter = () => {
    setShowGenericOnly(!showGenericOnly);
  };
  
  return (
    <>
      <Header />
      <Box 
        sx={{ 
          pt: 8, 
          pb: 6,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 'calc(100vh - 64px)',
          bgcolor: 'background.default'
        }}
      >
        <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
              Find Nearby Pharmacies
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 4 }}>
              Locate pharmacies near your current location to find medications quickly.
            </Typography>
            
            {error && (
              <Alert 
                severity="error" 
                sx={{ mb: 3, mx: 'auto', maxWidth: 'md' }}
                action={
                  <Button color="inherit" size="small" onClick={handleRefresh}>
                    Try Again
                  </Button>
                }
              >
                {error}
              </Alert>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Refresh />}
                onClick={handleRefresh}
                disabled={loading}
              >
                Refresh Location
              </Button>
              
              <Button
                variant={showGenericOnly ? "contained" : "outlined"}
                color={showGenericOnly ? "success" : "primary"}
                startIcon={showGenericOnly ? <Check /> : <LocalPharmacy />}
                onClick={toggleGenericFilter}
                disabled={loading}
              >
                {showGenericOnly ? "Showing Generic Only" : "Show Generic Pharmacies"}
              </Button>
            </Box>
            
            {pharmacies.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Found {showGenericOnly 
                    ? pharmacies.filter(p => p.isGeneric).length 
                    : pharmacies.length} pharmacies nearby
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Chip 
                    icon={<LocalPharmacy />} 
                    label="All Pharmacies" 
                    color={!showGenericOnly ? "primary" : "default"}
                    onClick={() => setShowGenericOnly(false)}
                    sx={{ mb: 1 }}
                  />
                  <Chip 
                    icon={<LocalPharmacy />} 
                    label="Generic Pharmacies" 
                    color={showGenericOnly ? "success" : "default"}
                    onClick={() => setShowGenericOnly(true)}
                    sx={{ mb: 1 }}
                  />
                </Box>
              </Box>
            )}
          </Box>
          
          <Box 
            sx={{ 
              height: '70vh', 
              position: 'relative',
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
          >
            {/* Map container */}
            <div 
              ref={mapContainerRef}
              style={{
                height: '100%',
                width: '100%',
                borderRadius: '8px'
              }}
            />
            
            {/* Loading overlay */}
            {(mapStatus !== 'ready' || loading) && (
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  height: '100%',
                  width: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  zIndex: 10,
                }}
              >
                <CircularProgress size={60} sx={{ mb: 3, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ color: 'primary.main' }}>
                  {!apiLoadedRef.current
                    ? 'Loading Google Maps...'
                    : !userLocation
                      ? 'Getting your location...'
                      : 'Finding nearby pharmacies...'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2, maxWidth: 'md', textAlign: 'center' }}>
                  Please allow location access when prompted to see pharmacies near you.
                </Typography>
              </Box>
            )}
            
            {/* Selected pharmacy details panel */}
            <AnimatePresence>
              {selectedPharmacy && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: 'absolute',
                    bottom: 20,
                    left: 20,
                    right: 20,
                    zIndex: 20,
                    maxWidth: '400px',
                    margin: '0 auto'
                  }}
                >
                  <Paper elevation={3} sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(255, 255, 255, 0.95)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="h6" component="h3" sx={{ 
                        color: selectedPharmacy.isGeneric ? 'success.main' : 'primary.main',
                        fontWeight: 'bold'
                      }}>
                        {selectedPharmacy.name}
                        {selectedPharmacy.isGeneric && (
                          <Chip 
                            label="Generic" 
                            size="small" 
                            color="success" 
                            sx={{ ml: 1, verticalAlign: 'middle' }}
                          />
                        )}
                      </Typography>
                      <Button 
                        size="small" 
                        onClick={() => setSelectedPharmacy(null)}
                      >
                        Close
                      </Button>
                    </Box>
                    
                    {selectedPharmacy.photoUrl && (
                      <Box sx={{ mt: 1, mb: 2, borderRadius: 1, overflow: 'hidden' }}>
                        <img 
                          src={selectedPharmacy.photoUrl} 
                          alt={selectedPharmacy.name}
                          style={{ width: '100%', height: 'auto', maxHeight: '150px', objectFit: 'cover' }}
                        />
                      </Box>
                    )}
                    
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {selectedPharmacy.formatted_address || selectedPharmacy.vicinity || 'Address not available'}
                    </Typography>
                    
                    {selectedPharmacy.formatted_phone_number && (
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Phone: {selectedPharmacy.formatted_phone_number}
                      </Typography>
                    )}
                    
                    {selectedPharmacy.rating && (
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Rating: {selectedPharmacy.rating} ⭐ ({selectedPharmacy.user_ratings_total || 0} reviews)
                      </Typography>
                    )}
                    
                    {selectedPharmacy.opening_hours && (
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {selectedPharmacy.opening_hours.isOpen() ? 'Open now' : 'Closed now'}
                      </Typography>
                    )}
                    
                    {selectedPharmacy.website && (
                      <Button 
                        variant="outlined" 
                        size="small" 
                        color="primary"
                        href={selectedPharmacy.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ mt: 1 }}
                      >
                        Visit Website
                      </Button>
                    )}
                  </Paper>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
          
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              This feature uses your device's location to find pharmacies within a 5km radius.
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
              <span style={{ color: '#2e7d32', fontWeight: 'bold' }}>Green markers</span> indicate pharmacies that may offer generic medicines.
            </Typography>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default PharmacyLocatePage;
