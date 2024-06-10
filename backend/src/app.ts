import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import path from 'path';
import routes from './routes';
import { authenticateToken, authorizeAdmin, authorizeUser } from './middleware/Authorization';
import errorHandler from './middleware/ErrorHandler';

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    session({
        secret: process.env.SESSION_SECRET || '',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === 'production', // Secure in production
            httpOnly: true,
            maxAge: 36000000, // 10hrs
        },
    })
);

// Routes
app.use('/api/v1', routes);

app.use('/api/hello', (req, res) => {
    res.json({ message: "Hello from backend!" });
});

// Serve static files from the frontend's dist directory
app.use(express.static(path.join(__dirname, '../../frontend/dist/')));

// Root page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

// login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/src/pages/login.html'));
});

// register page
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/src/pages/register.html'));
});

// Admin dashboard
// app.get('/admin/dashboard', authenticateToken, authorizeAdmin, (req, res) => {
//     res.sendFile(path.join(__dirname, '../../frontend/dist/src/pages/adminDashboard.html'));
// });

// User dashboard
// app.get('/user/dashboard', authenticateToken, authorizeUser, (req, res) => {
//     res.sendFile(path.join(__dirname, '../../frontend/dist/src/pages/userDashboard.html'));
// });

// Admin dashboard
app.get('/admin/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/src/pages/adminDashboard.html'));
});

// User dashboard
app.get('/user/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/src/pages/userDashboard.html'));
});

// Handle SPA routing, serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/src/index.html'));
});

// Error handler middleware
app.use(errorHandler);

export default app;
