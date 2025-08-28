const express = require('express');
const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());


app.post('/webhook', (req, res) => {
  
  const data = req.body; 
  console.log('Received form data:', data); 
  res.status(200).json({ status: 'success', received: data });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});