import { useState, useEffect } from 'react';
import { Box, Button, Container, Typography, CircularProgress } from '@mui/material';
import { UploadFileRounded, PresentationRounded } from '@mui/icons-material';
import Presenter from './presenter/Presenter';
import { Slide } from './presenter/slideinterfaces';

function App() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [presentationMode, setPresentationMode] = useState(false);
  
  // Check if a presentation file was provided via URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const presentationFile = params.get('file');
    
    if (presentationFile) {
      loadPresentation(presentationFile);
    }
  }, []);
  
  // Function to load presentation from a JSON file
  const loadPresentation = async (filePath: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(filePath);
      
      if (!response.ok) {
        throw new Error(`Failed to load presentation file (${response.status} ${response.statusText})`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setSlides(data);
        // Enter presentation mode automatically if slides were loaded
        setPresentationMode(true);
      } else {
        throw new Error('Invalid presentation format: expected an array of slides');
      }
    } catch (err) {
      console.error('Error loading presentation:', err);
      setError(err instanceof Error ? err.message : 'Failed to load presentation');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result;
        if (typeof content === 'string') {
          const data = JSON.parse(content);
          
          if (Array.isArray(data)) {
            setSlides(data);
            setPresentationMode(true);
          } else {
            setError('Invalid presentation format: expected an array of slides');
          }
        }
      } catch (err) {
        console.error('Error parsing JSON:', err);
        setError('Failed to parse presentation file. Please make sure it is valid JSON.');
      }
    };
    
    reader.onerror = () => {
      setError('Failed to read the file');
    };
    
    reader.readAsText(file);
  };
  
  // Exit presentation mode
  const handleExitPresentation = () => {
    setPresentationMode(false);
  };
  
  if (presentationMode && slides.length > 0) {
    return <Presenter slides={slides} boxProps={{ onDoubleClick: handleExitPresentation }} />;
  }
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#fafafa',
        py: 4
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            p: { xs: 3, md: 5 },
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              mb: 3,
              fontWeight: 600,
              color: '#1a1a1a',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}
          >
            Presentation Viewer
          </Typography>
          
          <Typography
            variant="body1"
            sx={{
              mb: 4,
              color: 'rgba(0, 0, 0, 0.6)',
            }}
          >
            Load a presentation JSON file to view your slides
          </Typography>
          
          {loading ? (
            <CircularProgress sx={{ my: 4 }} />
          ) : (
            <>
              <Button
                variant="contained"
                component="label"
                startIcon={<UploadFileRounded />}
                sx={{
                  backgroundColor: '#007aff',
                  py: 1.5,
                  px: 3,
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: '#0056b3',
                    boxShadow: 'none',
                  },
                }}
              >
                Upload Presentation JSON
                <input
                  type="file"
                  hidden
                  accept=".json"
                  onChange={handleFileUpload}
                />
              </Button>
              
              {slides.length > 0 && (
                <Button
                  variant="outlined"
                  startIcon={<PresentationRounded />}
                  onClick={() => setPresentationMode(true)}
                  sx={{
                    ml: 2,
                    py: 1.5,
                    px: 3,
                    borderColor: '#007aff',
                    color: '#007aff',
                    '&:hover': {
                      borderColor: '#0056b3',
                      backgroundColor: 'rgba(0, 122, 255, 0.04)',
                    },
                  }}
                >
                  View Presentation
                </Button>
              )}
            </>
          )}
          
          {error && (
            <Typography
              color="error"
              sx={{
                mt: 3,
                p: 2,
                bgcolor: 'rgba(211, 47, 47, 0.04)',
                borderRadius: 1,
              }}
            >
              {error}
            </Typography>
          )}
          
          {slides.length > 0 && (
            <Box sx={{ mt: 4, textAlign: 'left' }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Loaded Presentation ({slides.length} slides)
              </Typography>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 1,
                  backgroundColor: 'rgba(0, 0, 0, 0.03)',
                  maxHeight: '200px',
                  overflow: 'auto',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                }}
              >
                {slides.map((slide, index) => (
                  <Box key={index} sx={{ mb: 0.5 }}>
                    {index + 1}. [{slide.type}] {slide.title}
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default App; 