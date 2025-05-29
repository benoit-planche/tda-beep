# POC Communication Inter-Microservices

Ce POC démontre la communication entre deux microservices via une API REST :

1. **Product Service** (port 3000) : Gère les produits et leur stock
2. **Order Service** (port 3001) : Gère les commandes et communique avec le service Product

## Architecture

- Le service Order communique avec le service Product via des appels HTTP
- Les services partagent un réseau Docker pour la communication
- Chaque service maintient sa propre base de données en mémoire

## Prérequis

- Docker
- Docker Compose

## Démarrage

```bash
docker-compose up -d
```

## Test des Services

### Product Service

```bash
# Récupérer tous les produits
curl http://localhost:3000/products

# Récupérer un produit spécifique
curl http://localhost:3000/products/1

# Mettre à jour le stock d'un produit
curl -X PATCH http://localhost:3000/products/1/stock \
  -H "Content-Type: application/json" \
  -d '{"quantity": 2}'
```

### Order Service

```bash
# Créer une nouvelle commande
curl -X POST http://localhost:3001/orders \
  -H "Content-Type: application/json" \
  -d '{"productId": 1, "quantity": 2}'

# Récupérer toutes les commandes
curl http://localhost:3001/orders

# Récupérer une commande spécifique
curl http://localhost:3001/orders/1
```

## Communication entre Services

Le service Order communique avec le service Product de la manière suivante :

1. Lors de la création d'une commande, le service Order vérifie d'abord le stock disponible via le service Product
2. Si le stock est suffisant, le service Order met à jour le stock via le service Product
3. Enfin, le service Order crée la commande localement

## Arrêt

```bash
docker-compose down
```
