const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Stockage en mémoire (pour la démo)
const messages = [];

// Routes
app.get('/messages', (req, res) => {
  res.json(messages);
});

app.post('/messages', async (req, res) => {
  try {
    const message = {
      id: Date.now(),
      content: req.body.content,
      timestamp: new Date().toISOString()
    };
    
    // Stocker le message localement
    messages.unshift(message);
    
    // Notifier les autres services
    try {
      // Notifier le service WebSocket
      await axios.post('http://websocket-service:8080/notify', message);
    } catch (error) {
      console.error('Error notifying WebSocket service:', error.message);
    }
    
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint pour recevoir les notifications des autres services
app.post('/notify', (req, res) => {
  const message = req.body;
  if (!messages.find(m => m.id === message.id)) {
    messages.unshift(message);
  }
  res.status(200).send();
});

// Start server
app.listen(port, () => {
  console.log(`REST service listening on port ${port}`);
}); 