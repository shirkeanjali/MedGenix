import { useState, useEffect, useRef } from 'react';
import { Box, Container, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { LocationOn, Refresh } from '@mui/icons-material';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import usePageLoading from '../hooks/usePageLoading';

// Google Maps API key
const GOOGLE_MAPS_API_KEY = 'AIzaSyDHrONTX_PmQf0lT1_6rIZvnJ2zrpbQU40';

const PharmacyLocatePage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapStatus, setMapStatus] = useState('loading'); // 'loading', 'ready', 'error'
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const apiLoadedRef = useRef(false);
  const mapInitializedRef = useRef(false);
  
  // Connect to the loading system
  usePageLoading(loading, 'pharmacy-locate-page');
  
  // Load Google Maps API once
  useEffect(() => {
    const loadGoogleMapsApi = () => {
      if (window.google?.maps || apiLoadedRef.current) {
        apiLoadedRef.current = true;
        return Promise.resolve();
      }
      
      return new Promise((resolve, reject) => {
        try {
          // Create script element
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
          script.async = true;
          script.defer = true;
          
          // Set callbacks
          window.initGoogleMaps = () => {
            apiLoadedRef.current = true;
            resolve();
            delete window.initGoogleMaps;
          };
          
          script.onerror = () => {
            reject(new Error('Failed to load Google Maps API'));
          };
          
          // Append to document
          script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initGoogleMaps`;
          document.head.appendChild(script);
        } catch (error) {
          reject(error);
        }
      });
    };
    
    loadGoogleMapsApi()
      .catch(error => {
        console.error('Error loading Google Maps API:', error);
        setError('Failed to load Google Maps. Please refresh the page.');
        setMapStatus('error');
        setLoading(false);
      });
      
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
  
  // Initialize map when container is ready, API is loaded, and we have user location
  useEffect(() => {
    // Only proceed if we have all requirements
    if (!mapContainerRef.current || !userLocation || !apiLoadedRef.current || mapInitializedRef.current) {
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
        mapInstanceRef.current = new window.google.maps.Map(
          mapContainerRef.current,
          mapOptions
        );
        
        // Add user marker
        const userMarker = new window.google.maps.Marker({
          position: userLocation,
          map: mapInstanceRef.current,
          title: 'Your Location',
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#4285F4',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
          },
        });
        markersRef.current.push(userMarker);
        
        // Add example pharmacy markers
        const pharmacyLocations = [
          { lat: userLocation.lat + 0.01, lng: userLocation.lng + 0.01, name: "City Pharmacy", address: "123 Main St" },
          { lat: userLocation.lat - 0.01, lng: userLocation.lng - 0.01, name: "Health Plus Pharmacy", address: "456 Oak Ave" },
          { lat: userLocation.lat + 0.015, lng: userLocation.lng - 0.005, name: "MedCare Pharmacy", address: "789 Pine Blvd" },
          { lat: userLocation.lat - 0.008, lng: userLocation.lng + 0.012, name: "Wellness Pharmacy", address: "321 Elm St" },
        ];
        
        pharmacyLocations.forEach(pharmacy => {
          const marker = new window.google.maps.Marker({
            position: { lat: pharmacy.lat, lng: pharmacy.lng },
            map: mapInstanceRef.current,
            title: pharmacy.name,
            icon: {
              url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
              scaledSize: new window.google.maps.Size(32, 32),
            },
          });
          markersRef.current.push(marker);
          
          // Add info window
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 8px;">
                <h3 style="font-weight: bold; font-size: 16px; margin-bottom: 4px;">${pharmacy.name}</h3>
                <p style="margin: 4px 0;">${pharmacy.address}</p>
              </div>
            `,
          });
          
          marker.addListener('click', () => {
            infoWindow.open(mapInstanceRef.current, marker);
          });
        });
        
        mapInitializedRef.current = true;
        setMapStatus('ready');
        setLoading(false);
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
      mapInitializedRef.current = false;
    };
  }, [userLocation]);
  
  // Handle refresh to get new location
  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    setMapStatus('loading');
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
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<Refresh />}
              onClick={handleRefresh}
              disabled={loading}
              sx={{ mb: 4 }}
            >
              Refresh Location
            </Button>
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
          </Box>
          
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              This feature uses your device's location to find pharmacies within a 5km radius.
            </Typography>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default PharmacyLocatePage;
