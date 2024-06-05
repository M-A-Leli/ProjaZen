import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import path from 'path';
import routes from './routes';
import { authorizeAdmin, authorizeUser } from './middleware/Authorization';
import errorHandler from './middleware/ErrorHandler'

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
    res.json({message: "Hello from backend!"});
});

if (process.env.NODE_ENV === 'development') {
    // Serve static files from the frontend's src directory
    app.use(express.static(path.join(__dirname, '../../frontend/src')));
}

if (process.env.NODE_ENV === 'production') {
    // Serve static files from the frontend's dist directory
    app.use(express.static(path.join(__dirname, '../../frontend/dist')));
}

// Root page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

// login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/pages/Login.html'));
});

// register page
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '/pages/Register.html'));
});

// Admin dashboard
app.get('/admin/dashboard', authorizeAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '/pages/DashboardAdmin.html'));
});

// User dashboard
app.get('/user/dashboard', authorizeUser, (req, res) => {
    res.sendFile(path.join(__dirname, '/pages/DashboardUser.html'));
});

// Handle SPA routing, serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

// !
// Handle other routes or show an error page
// app.get('*', (req, res) => {
//     res.status(404).sendFile(path.join(__dirname, 'pages/Error.html'));
// });

// Error handler middleware
app.use(errorHandler);

export default app;
