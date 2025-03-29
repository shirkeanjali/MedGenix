import { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  IconButton, 
  Paper, 
  TextField, 
  Typography, 
  Fade,
  Slide,
  Fab,
  Avatar,
  Divider,
  CircularProgress,
  Link
} from '@mui/material';
import { 
  Chat as ChatIcon, 
  Close as CloseIcon,
  Send as SendIcon,
  SmartToy as BotIcon,
  Error as ErrorIcon,
  OpenWith as ResizeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SYSTEM_PROMPT = `You are MedGenix Assistant, a helpful medical and healthcare AI assistant for the MedGenix platform. Your role is to:
1. Help users navigate the MedGenix platform
2. Provide information about medicines and healthcare
3. Guide users through prescription uploads
4. Explain medical terms and generic alternatives
5. Assist with pharmacy location services
6. Help with account-related queries
7. Guide users on language preferences

Available Navigation Routes:
- Home: "/"
- Dashboard: "/dashboard" (for regular users) or "/chemist-dashboard" (for chemists)
- Pharmacy Locator: "/pharmacy-locate"
- Generic Alternatives: "/generic-alternatives"
- Sign Up: "/signup"
- Login: "/login"
- How It Works: "/how-it-works"
- FAQ: "/faq"
- About Us: "/about"
- Prescription Guide: "/prescription-guide"

Platform Features:
1. Pharmacy Location:
   - Users can find nearby pharmacies by allowing location access
   - Shows the number of pharmacies in your area
   - Provides direct Google Maps links for directions
   - No manual location entry required
   - Real-time pharmacy locations and distances

2. Prescription Management:
   - Easy prescription upload and scanning
   - Track prescription history in your dashboard
   - View all past prescriptions and their status
   - Get instant price comparisons between brand and generic medicines
   - Compare prices across different pharmacies
   - Find cost-effective generic alternatives

3. Generic Alternatives Search:
   - Search for generic alternatives of any medicine
   - Compare prices between brand and generic versions
   - View detailed information about alternatives
   - Find cost-effective options
   - Access through dedicated generic alternatives page

4. Language Support:
   - Switch between multiple languages
   - Change language preferences anytime
   - Access platform content in preferred language
   - Language selection in header menu
   - Supports multiple regional languages

Important guidelines:
- Keep responses concise and clear
- When suggesting navigation, use the format: [Navigate to {page name}]({route})
- Never prescribe medications or make medical diagnoses
- Always encourage consulting healthcare professionals
- Provide general information only
- Use simple, understandable language
- Include relevant disclaimers when appropriate
- When explaining pharmacy location feature, emphasize the automatic location detection and Google Maps integration
- When explaining prescription features, highlight the price comparison and generic alternatives benefits
- When users ask about language settings, guide them to the language selector in the header
- When users ask about generic alternatives, guide them to the dedicated generic alternatives search page`;

const Chatbot = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your MedGenix assistant. I can help you navigate our platform, search for medicines, upload prescriptions, and answer your healthcare queries. How can I assist you today?",
      isBot: true
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!import.meta.env.VITE_GROQ_API_KEY) {
      setError("API key is not configured. Please check your environment variables.");
      console.error('Missing GROQ API key');
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNavigation = (route) => {
    // Remove any URL encoding, quotes, and curly braces from the route
    const cleanRoute = route
      .replace(/%7B|%7D/g, '')  // Remove URL encoded braces
      .replace(/[{}]/g, '')     // Remove curly braces
      .replace(/"/g, '')        // Remove quotes
      .trim();                  // Remove any extra whitespace
    
    // Handle role-based dashboard navigation
    if (cleanRoute === '/dashboard') {
      const dashboardRoute = user?.role === 'chemist' ? '/chemist-dashboard' : '/dashboard';
      navigate(dashboardRoute);
    } else {
      navigate(cleanRoute);
    }
    
    setIsOpen(false);
  };

  const renderMessage = (text) => {
    // First handle navigation links
    const navigationRegex = /\[Navigate to (.*?)\]\((.*?)\)/g;
    const parts = text.split(navigationRegex);
    
    return parts.map((part, index) => {
      if (index % 3 === 1) { // This is the page name
        const route = parts[index + 1];
        return (
          <Link
            key={index}
            component="button"
            onClick={() => handleNavigation(route)}
            sx={{
              color: 'primary.main',
              textDecoration: 'none',
              fontWeight: 500,
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            {part}
          </Link>
        );
      }
      // Only return the text part if it's not a route
      if (index % 3 === 2) {
        return null;
      }

      // Handle highlighted text (text between **)
      const highlightRegex = /\*\*(.*?)\*\*/g;
      const textParts = part.split(highlightRegex);
      
      return textParts.map((textPart, textIndex) => {
        if (textIndex % 2 === 1) { // This is the highlighted text
          return (
            <Typography
              key={textIndex}
              component="span"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                display: 'inline',
                background: 'linear-gradient(120deg, rgba(103, 194, 124, 0.1), rgba(0, 128, 128, 0.1))',
                padding: '0 4px',
                borderRadius: '4px',
              }}
            >
              {textPart}
            </Typography>
          );
        }
        return textPart;
      });
    });
  };

  const getGroqResponse = async (userMessage) => {
    if (!import.meta.env.VITE_GROQ_API_KEY) {
      throw new Error("API key is not configured. Please check your environment variables.");
    }

    try {
      console.log('Making API request with key:', import.meta.env.VITE_GROQ_API_KEY.substring(0, 5) + '...');
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages.map(msg => ({
              role: msg.isBot ? "assistant" : "user",
              content: msg.text
            })),
            { role: "user", content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 300,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('API Error Response:', data);
        throw new Error(data.error?.message || `HTTP error! status: ${response.status}`);
      }

      if (!data.choices || !data.choices[0]?.message?.content) {
        console.error('Unexpected API Response:', data);
        throw new Error('Invalid response format from API');
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error('Groq API Error:', error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    const userMessage = inputMessage.trim();
    setInputMessage('');
    setError(null);
    
    // Add user message
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setIsLoading(true);

    try {
      const botResponse = await getGroqResponse(userMessage);
      setMessages(prev => [...prev, { text: botResponse, isBot: true }]);
    } catch (error) {
      const errorMessage = error.message || "I apologize, but I'm having trouble processing your request. Please try again later.";
      setError(errorMessage);
      console.error('Error in chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1000,
      }}
    >
      {/* Chat Window */}
      <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
        <Paper
          elevation={3}
          sx={{
            width: isExpanded ? '600px' : '350px',
            height: isExpanded ? '80vh' : '500px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: 2,
            mb: 2,
            transition: 'all 0.3s ease-in-out',
            position: 'relative',
          }}
        >
          {/* Chat Header */}
          <Box
            sx={{
              p: 2,
              bgcolor: 'primary.main',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BotIcon />
              <Typography variant="h6">MedGenix Assistant</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                size="small"
                onClick={() => setIsExpanded(!isExpanded)}
                sx={{ 
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                <ResizeIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => setIsOpen(false)}
                sx={{ color: 'white' }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Chat Messages */}
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: message.isBot ? 'flex-start' : 'flex-end',
                }}
              >
                <Box
                  sx={{
                    maxWidth: '80%',
                    bgcolor: message.isBot ? 'grey.100' : 'primary.main',
                    color: message.isBot ? 'text.primary' : 'white',
                    p: 1.5,
                    borderRadius: 2,
                    position: 'relative',
                  }}
                >
                  {message.isBot && (
                    <Avatar
                      sx={{
                        position: 'absolute',
                        top: -8,
                        left: -8,
                        width: 24,
                        height: 24,
                        bgcolor: 'primary.main',
                      }}
                    >
                      <BotIcon sx={{ fontSize: 16 }} />
                    </Avatar>
                  )}
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {renderMessage(message.text)}
                  </Typography>
                </Box>
              </Box>
            ))}
            {isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1, alignItems: 'center' }}>
                <CircularProgress size={20} />
                <Typography variant="body2">Thinking...</Typography>
              </Box>
            )}
            {error && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1, alignItems: 'center', color: 'error.main' }}>
                <ErrorIcon fontSize="small" />
                <Typography variant="body2">{error}</Typography>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Chat Input */}
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                disabled={isLoading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  '&.Mui-disabled': {
                    bgcolor: 'grey.300',
                  },
                }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Slide>

      {/* Chat Button */}
      <Fade in={!isOpen}>
        <Fab
          color="primary"
          onClick={() => setIsOpen(true)}
          sx={{
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          <ChatIcon />
        </Fab>
      </Fade>
    </Box>
  );
};

export default Chatbot; 