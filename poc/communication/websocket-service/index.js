const express = require('express');
const WebSocket = require('ws');

const app = express();
const port = 8080;

// Stockage en mémoire (pour la démo)
const messages = [];

// WebSocket server
const wss = new WebSocket.Server({ noServer: true });

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('New WebSocket connection');

  // Envoyer l'historique des messages au nouveau client
  ws.send(JSON.stringify({ type: 'history', messages }));

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      const messageObj = {
        id: Date.now(),
        content: data.content,
        timestamp: new Date().toISOString()
      };

      // Stocker le message localement
      messages.unshift(messageObj);
      
      // Broadcast à tous les clients connectés
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'message', message: messageObj }));
        }
      });
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });
});

// Endpoint HTTP pour recevoir les notifications des autres services
app.use(express.json());
app.post('/notify', (req, res) => {
  const message = req.body;
  if (!messages.find(m => m.id === message.id)) {
    messages.unshift(message);
    // Broadcast aux clients WebSocket
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'message', message }));
      }
    });
  }
  res.status(200).send();
});

// HTTP server
const server = app.listen(port, () => {
  console.log(`WebSocket service listening on port ${port}`);
});

// Upgrade HTTP server to WebSocket
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
}); 