import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB } from './database/dbInit';

// Set the port
const port = process.env.PORT || 3000;

const startServer = async () => {
    await connectDB();

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
};

startServer();
