# POC Communication Inter-Microservices

Ce POC démontre trois types de communication entre microservices :

1. REST pour les opérations CRUD basiques
2. gRPC pour les communications performantes
3. WebSocket pour la communication en temps réel

## Architecture

- **REST Service** (port 3000) : API REST pour les opérations CRUD sur les messages
- **gRPC Service** (port 50051) : Service gRPC pour les communications performantes
- **WebSocket Service** (port 8081) : Service WebSocket pour la communication en temps réel

Les services communiquent directement entre eux via des appels HTTP.

## Prérequis

- Docker
- Docker Compose

## Démarrage

```bash
docker-compose up -d
```

## Test des Services

### REST Service

```bash
# Récupérer les messages
curl http://localhost:3000/messages

# Envoyer un message
curl -X POST http://localhost:3000/messages \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello via REST"}'
```

### gRPC Service

Pour tester le service gRPC, vous pouvez utiliser un client gRPC comme grpcurl :

```bash
# Installer grpcurl
go install github.com/fullstorydev/grpcurl/cmd/grpcurl@latest

# Récupérer les messages
grpcurl -plaintext localhost:50051 message.MessageService/GetMessages

# Envoyer un message
grpcurl -plaintext -d '{"content": "Hello via gRPC"}' localhost:50051 message.MessageService/SendMessage
```

### WebSocket Service

Pour tester le service WebSocket, vous pouvez utiliser un client WebSocket comme wscat :

```bash
# Installer wscat
npm install -g wscat

# Se connecter au WebSocket
wscat -c ws://localhost:8081

# Envoyer un message
{"content": "Hello via WebSocket"}
```

## Communication entre Services

Les services communiquent directement entre eux :

- Chaque service maintient son propre stockage en mémoire des messages
- Lorsqu'un message est créé, le service notifie les autres services via des appels HTTP
- Le service WebSocket diffuse les messages à tous les clients connectés

## Arrêt

```bash
docker-compose down
```

Pour supprimer les volumes (données) :

```bash
docker-compose down -v
```
