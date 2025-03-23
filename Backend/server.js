import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import translationRouter from './routes/translationRoutes.js';
import pharmacyRouter from './routes/pharmacyRoutes.js';
import session from 'express-session';

const app = express();
const PORT = process.env.PORT || 8000;

// Log environment variables on startup
console.log('Starting server with:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- PORT:', PORT);
console.log('- FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('- GOOGLE_MAPS_API_KEY available:', process.env.GOOGLE_MAPS_API_KEY ? 'Yes' : 'No');

// Connect to MongoDB
connectDB();

// CORS Configuration - Allow requests from any origin during development
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', process.env.FRONTEND_URL],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'medgenix-fallback-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Explicitly handle OPTIONS requests for preflight
app.options('*', cors());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Log incoming requests to pharmacy endpoints
app.use('/api/pharmacies', (req, res, next) => {
  console.log(`${new Date().toISOString()} - Pharmacy API request: ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/translation', translationRouter);
app.use('/api/pharmacies', pharmacyRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ success: false, message: 'Something broke!', error: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
});

export default app;