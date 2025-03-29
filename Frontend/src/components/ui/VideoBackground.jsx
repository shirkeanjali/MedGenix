import { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import LoadingAnimation from '../common/LoadingAnimation';

const VideoBackground = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const videoRef = useRef(null);

  // Handle successful load
  const handleVideoLoad = () => {
    setLoading(false);
  };

  // Handle load error
  const handleVideoError = () => {
    console.error('Failed to load video');
    setError(true);
    setLoading(false);
  };

  // Set a timeout to avoid long loading times
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setError(true);
        setLoading(false);
      }
    }, 5000); // 5 seconds timeout (shorter than before since video loads faster than 3D)

    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh', 
        zIndex: 0,
        overflow: 'hidden',
        backgroundColor: 'rgba(248, 249, 250, 0.15)', // More transparent background color
      }}
    >
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <LoadingAnimation text="Loading animation..." />
        </Box>
      )}

      {/* Video container */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          opacity: loading ? 0 : 1,
          transition: 'opacity 1s ease',
          '& video': {
            objectFit: 'cover',
            width: '100%',
            height: '100%',
          }
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={handleVideoLoad}
          onError={handleVideoError}
        >
          <source src="/images/pill-and-dna-animation.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </Box>
      
      {/* Subtle overlay to ensure content readability */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          background: 'radial-gradient(circle at center, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
    </Box>
  );
};

export default VideoBackground;
