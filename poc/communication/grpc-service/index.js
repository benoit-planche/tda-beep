const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const axios = require('axios');

// Charger le fichier proto
const packageDefinition = protoLoader.loadSync('./message.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const messageService = protoDescriptor.message;

// Stockage en mémoire des messages
const messages = [];

// Implémentation du service
const server = new grpc.Server();

server.addService(messageService.MessageService.service, {
  getMessages: (call, callback) => {
    callback(null, { messages: messages });
  },

  sendMessage: (call, callback) => {
    const message = {
      id: Date.now().toString(),
      content: call.request.content,
      timestamp: new Date().toISOString(),
      type: 'grpc'
    };

    messages.push(message);

    // Notifier le service WebSocket
    axios.post('http://websocket-service:8080/notify', message)
      .catch(error => console.error('Error notifying WebSocket service:', error));

    callback(null, message);
  }
});

// Démarrer le serveur gRPC
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  server.start();
  console.log('gRPC server running on port 50051');
}); 