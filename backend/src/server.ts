import express from 'express';

const app = express();
const port = 3000;

app.get('/api/hello', (req, res) => {
  res.send({ message: 'Hello from the backend!' });
});

app.listen(port, () => {
  console.log(`Backend is running on http://localhost:${port}`);
});
