import dotenv from 'dotenv';
dotenv.config();

import app from './app';

// Set the port
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
