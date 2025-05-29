# POC Keycloak OIDC

Ce POC démontre une configuration minimale de Keycloak pour l'authentification OIDC.

## Prérequis

- Docker
- Docker Compose

## Configuration

1. Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```bash
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=admin
POSTGRES_USER=keycloak
POSTGRES_PASSWORD=password
```

## Démarrage

1. Lancez les services :

    ```bash
    docker-compose up -d
    ```

2. Accédez à la console d'administration Keycloak :

    - URL : <http://localhost:8080>
    - Username : admin
    - Password : admin

## Configuration du Realm

1. Créez un nouveau realm "beep"
2. Créez un nouveau client "beep-client" avec les paramètres suivants :
   - Client ID : beep-client
   - Client Protocol : openid-connect
   - Access Type : confidential
   - Valid Redirect URIs : <http://localhost:3000/>*
   - Web Origins : <http://localhost:3000>

3. Dans l'onglet "Credentials", notez le "Secret" généré

## Test de l'authentification

Pour tester l'authentification, vous pouvez utiliser l'URL suivante :

```
http://localhost:8080/realms/beep/protocol/openid-connect/auth?client_id=beep-client&response_type=code&scope=openid&redirect_uri=http://localhost:3000
```

## Arrêt

Pour arrêter les services :

```bash
docker-compose down
```

Pour supprimer les volumes (données) :

```bash
docker-compose down -v
```
