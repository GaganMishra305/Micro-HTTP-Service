const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Simplified Test' });
});

app.listen(8000, '0.0.0.0', () => {
  console.log('Test server running on port 8000');
});