import { useState, useEffect, useRef } from 'react';
import { Box, Container, Typography, Button, CircularProgress, Alert, Chip, Paper } from '@mui/material';
import { LocationOn, Refresh, LocalPharmacy, Check } from '@mui/icons-material';
import { AnimatePresence } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import usePageLoading from '../hooks/usePageLoading';

// Google Maps API key
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Keywords that might indicate a generic pharmacy
const GENERIC_KEYWORDS = [
  'generic', 'affordable', 'discount', 'low cost', 'budget', 
  'cheap', 'inexpensive', 'economical', 'reasonable',
  'wholesale', 'bulk', 'public', 'government', 'subsidized'
];

// Function to load Google Maps script
const loadGoogleMapsScript = () => {
  return new Promise((resolve, reject) => {
    // If Google Maps is already loaded, resolve immediately
    if (window.google?.maps) {
      console.log('Google Maps already loaded');
      resolve();
      return;
    }

    // If we're already loading, wait for the existing load
    if (window.isLoadingGoogleMaps) {
      console.log('Waiting for existing Google Maps load');
      const checkLoaded = setInterval(() => {
        if (window.google?.maps) {
          clearInterval(checkLoaded);
          resolve();
        }
      }, 100);
      return;
    }

    window.isLoadingGoogleMaps = true;
    console.log('Loading Google Maps with key:', GOOGLE_MAPS_API_KEY);

    // Create script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&v=weekly`;
    script.async = true;
    script.defer = true;

    // Add error callback to window
    window.gm_authFailure = () => {
      console.error('Google Maps authentication failed');
      reject(new Error('Google Maps authentication failed - please check your API key configuration'));
    };

    // Set up event handlers
    script.onload = () => {
      console.log('Google Maps script loaded successfully');
      window.isLoadingGoogleMaps = false;
      resolve();
    };

    script.onerror = (error) => {
      console.error('Failed to load Google Maps script:', error);
      window.isLoadingGoogleMaps = false;
      reject(new Error('Failed to load Google Maps API - check console for details'));
    };

    // Add the script to the document
    document.head.appendChild(script);
  });
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
  const placesServiceRef = useRef(null);
  
  // Connect to the loading system
  usePageLoading(loading, 'pharmacy-locate-page');
  
  // Load Google Maps API
  useEffect(() => {
    const initializeGoogleMaps = async () => {
      try {
        await loadGoogleMapsScript();
        apiLoadedRef.current = true;
        setMapStatus(prev => prev === 'loading' ? 'loading-complete' : prev);
      } catch (error) {
        console.error('Failed to load Google Maps API:', error);
        setError('Failed to load Google Maps. Please refresh the page.');
        setMapStatus('error');
        setLoading(false);
      }
    };

    initializeGoogleMaps();
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
      
      const handleLocationError = (error) => {
        console.error('Error getting location:', error);
        let errorMessage = 'Unable to access your location. ';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please enable location services in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable. Please try again.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Request timed out. Please check your connection and try again.';
            break;
          default:
            errorMessage += 'Please try again or enter your location manually.';
        }
        
        setError(errorMessage);
        setLoading(false);
      };
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userPos);
        },
        handleLocationError,
        { 
          enableHighAccuracy: true, 
          timeout: 15000, 
          maximumAge: 10000 
        }
      );
    };
    
    getUserLocation();
  }, [userLocation]);
  
  // Function to check if a pharmacy is likely to be generic
  const isGenericPharmacy = (pharmacy) => {
    if (!pharmacy) return false;
    
    const nameAndVicinity = `${pharmacy.name} ${pharmacy.vicinity || ''} ${pharmacy.types?.join(' ') || ''}`.toLowerCase();
    
    // Check if any generic keywords are in the name or vicinity
    return GENERIC_KEYWORDS.some(keyword => nameAndVicinity.includes(keyword.toLowerCase())) ||
           // Check if rating is lower (often indicates more affordable options)
           (pharmacy.rating && pharmacy.rating < 3.5) ||
           // Check if it's a government pharmacy
           (pharmacy.types && pharmacy.types.includes('health'));
  };
  
  // Search for nearby pharmacies using Places API
  const searchNearbyPharmacies = (map, location) => {
    if (!window.google?.maps || !location) return;
    
    // Create Places service if it doesn't exist
    if (!placesServiceRef.current) {
      placesServiceRef.current = new window.google.maps.places.PlacesService(map);
    }
    
    const request = {
      location: location,
      radius: 5000, // 5km radius
      type: 'pharmacy',
      keyword: 'pharmacy medical store drugstore'
    };
    
    placesServiceRef.current.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        // Process results and identify generic pharmacies
        const processedPharmacies = results.map(place => ({
          ...place,
          isGeneric: isGenericPharmacy(place)
        }));
        
        setPharmacies(processedPharmacies);
        setLoading(false);
      } else {
        console.error('Error fetching nearby pharmacies:', status);
        setError('Failed to find nearby pharmacies. Please try again.');
        setLoading(false);
      }
    });
  };
  
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
        
        // Search for nearby pharmacies
        searchNearbyPharmacies(map, userLocation);
        
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
      if (!pharmacy.geometry?.location) return;
      
      const position = {
        lat: pharmacy.geometry.location.lat(),
        lng: pharmacy.geometry.location.lng()
      };
      
      // Create marker
      const marker = new window.google.maps.Marker({
        position: position,
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
        
        // Get additional details for the pharmacy
        const getPlaceDetails = () => {
          const request = {
            placeId: pharmacy.place_id,
            fields: ['name', 'formatted_address', 'formatted_phone_number', 'opening_hours', 'photos', 'rating', 'website']
          };
          
          placesServiceRef.current.getDetails(request, (place, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              // Update selected pharmacy with details
              setSelectedPharmacy({
                ...pharmacy,
                ...place,
                photoUrl: place.photos && place.photos.length > 0 
                  ? place.photos[0].getUrl({ maxWidth: 300, maxHeight: 200 })
                  : null
              });
              
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
            }
          });
        };
        
        getPlaceDetails();
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
