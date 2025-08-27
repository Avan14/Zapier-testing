const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Webhook endpoint
app.post('/webhook', (req, res) => {
  const data = req.body; // Data from Zapier (form response)
  console.log('Received form data:', data); // Log for debugging
  // For basic connectivity, just return success
  res.status(200).json({ status: 'success', received: data });
});

// Health check (optional, for testing)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});