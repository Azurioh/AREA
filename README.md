# 🔗 AREA - Action REAction

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/Fastify-5.6-black?logo=fastify)](https://fastify.io/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Kotlin](https://img.shields.io/badge/Kotlin-Android-7F52FF?logo=kotlin)](https://kotlinlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.5-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-Latest-DC382D?logo=redis)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)](https://www.docker.com/)

**AREA** (Action REAction) est une plateforme d'automatisation permettant de connecter différents services et de créer des automatisations personnalisées. Inspiré par des services comme IFTTT ou Zapier, AREA permet aux utilisateurs de lier des **actions** (déclencheurs) à des **réactions** (conséquences).

---

## 📖 Table des matières

- [✨ Fonctionnalités](#-fonctionnalités)
- [🛠️ Stack Technique](#️-stack-technique)
- [🚀 Démarrage Rapide](#-démarrage-rapide)
- [📁 Structure du Projet](#-structure-du-projet)
- [🔌 Services Supportés](#-services-supportés)
- [📚 Documentation](#-documentation)
- [🤝 Contribuer](#-contribuer)
- [👥 Équipe](#-équipe)

---

## ✨ Fonctionnalités

- 🔄 **Automatisations personnalisées** - Créez des workflows en connectant actions et réactions
- 🌐 **Multi-plateformes** - Web, Mobile (Android) avec une API centralisée
- 🔐 **Authentification sécurisée** - OAuth2, JWT avec refresh tokens
- 🔗 **Intégrations multiples** - GitHub, Discord, Spotify, Dropbox, Twitch, Unsplash, NASA
- 🌍 **Multilingue** - Support Français/Anglais
- 🎨 **Interface moderne** - Design responsive avec thème sombre/clair

---

## 🛠️ Stack Technique

### Backend
| Technologie | Version | Description |
|-------------|---------|-------------|
| **Fastify** | 5.6 | Framework Node.js haute performance |
| **TypeScript** | 5.9 | Typage statique |
| **MongoDB** | 6.5 | Base de données NoSQL |
| **Redis** | Latest | Cache et gestion de sessions |
| **Zod** | 4.1 | Validation de schémas |
| **JWT** | 9.0 | Authentification |

### Frontend Web
| Technologie | Version | Description |
|-------------|---------|-------------|
| **React** | 19 | Bibliothèque UI |
| **Vite** | 7.2 | Build tool |
| **TailwindCSS** | 3.4 | Framework CSS |
| **Framer Motion** | 12 | Animations |
| **React Router** | 7.9 | Routing |

### Mobile
| Technologie | Description |
|-------------|-------------|
| **Kotlin** | Langage de programmation |
| **Jetpack Compose** | UI moderne |
| **Android** | Plateforme cible |

### DevOps
| Outil | Description |
|-------|-------------|
| **Docker Compose** | Orchestration des conteneurs |
| **Turborepo** | Gestion du monorepo |
| **Biome** | Linting & Formatting |
| **Husky** | Git hooks |
| **Jest** | Tests unitaires |

---

## 🚀 Démarrage Rapide

### Prérequis

- **Node.js** >= 20.x
- **pnpm** >= 10.24.0
- **Docker** & **Docker Compose**

### Installation

```bash
# Cloner le repository
git clone git@github.com:Azurioh/AREA.git
cd AREA

# Installer les dépendances
pnpm install
```

### Configuration

Créez un fichier `.env` à la racine avec les variables suivantes :

```env
# Server
NODE_ENV=development
PORT=3000
BASE_API_URL=http://localhost:3000

# Database
MONGO_URI=mongodb://mongodb:27017
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=password
MONGO_INITDB_DATABASE=area

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# Security
CRYPT_SECRET_KEY=your_crypt_key
JWT_ACCESS_TOKEN_SECRET=your_access_secret
JWT_REFRESH_TOKEN_SECRET=your_refresh_secret
JWT_STATE_TOKEN_SECRET=your_state_secret

# OAuth Callbacks
WEB_OAUTH_CALLBACK_URL=http://localhost:8081/oauth/callback
MOBILE_OAUTH_CALLBACK_URL=area://oauth/callback

# OAuth Providers
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_BOT_TOKEN=your_discord_bot_token

SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

DROPBOX_CLIENT_ID=your_dropbox_client_id
DROPBOX_CLIENT_SECRET=your_dropbox_client_secret

UNSPLASH_CLIENT_ID=your_unsplash_client_id

TWITCH_CLIENT_ID=your_twitch_client_id
TWITCH_CLIENT_SECRET=your_twitch_client_secret
TWITCH_WEBHOOK_SECRET=your_twitch_webhook_secret
```

### Lancer avec Docker (Recommandé)

```bash
# Démarrer tous les services
docker compose up -d

# Voir les logs
docker compose logs -f
```

**Services disponibles :**
| Service | URL |
|---------|-----|
| API Backend | http://localhost:8080 |
| Client Web | http://localhost:8081 |
| Android APK | http://localhost:8081/client.apk |
| MongoDB | localhost:27017 |
| Redis | localhost:6379 |

### Développement Local

```bash
# Lancer en mode développement (tous les apps)
pnpm dev

# Lancer uniquement le backend
pnpm --filter area-backend dev

# Lancer uniquement le frontend
pnpm --filter @area/frontend dev

# Build de production
pnpm build

# Lancer les tests
pnpm test

# Linting
pnpm lint

# Formatage
pnpm format
```

---

## 📁 Structure du Projet

```
AREA/
├── 📁 apps/
│   ├── 📁 backend/           # API Fastify (TypeScript)
│   │   ├── src/
│   │   │   ├── config/       # Configuration
│   │   │   ├── modules/      # Modules métier (auth, users, services...)
│   │   │   └── plugins/      # Plugins Fastify
│   │   └── .docker/          # Dockerfiles
│   │
│   ├── 📁 frontend/          # Client Web (React + Vite)
│   │   ├── src/
│   │   │   ├── components/   # Composants UI réutilisables
│   │   │   ├── features/     # Fonctionnalités par domaine
│   │   │   ├── hooks/        # Custom hooks
│   │   │   └── lib/          # Utilitaires
│   │   └── .docker/          # Dockerfiles
│   │
│   └── 📁 mobile/            # Application Android (Kotlin)
│       └── Kotlin-JP/        # Projet Android Studio
│
├── 📁 packages/
│   └── 📁 shared/            # Code partagé (types, schemas, utils)
│       ├── enums/
│       ├── schemas/
│       ├── types/
│       └── utils/
│
├── 📁 docs/                  # Documentation
│   ├── architecture/
│   ├── benchmarks/
│   └── contributing/
│
├── 📁 benchmarks/            # Tests de performance
│
├── 📄 docker-compose.yml     # Orchestration Docker
├── 📄 turbo.json            # Configuration Turborepo
├── 📄 biome.json            # Configuration Biome (linting)
└── 📄 pnpm-workspace.yaml   # Configuration pnpm workspaces
```

---

## 🔌 Services Supportés

### Actions (Déclencheurs)
| Service | Actions disponibles |
|---------|---------------------|
| **Discord** | Nouveau message |
| **GitHub** | Nouveau watch, Nouveau push, Nouvelle pull request |
| **Dropbox** | Fichier upload, Fichier modifié, Dossier upload, Dossier modifié |
| **NASA** | Nouvelle image APOD (Astronomy Picture of the Day) |
| **Spotify** | Artiste écouté |
| **Twitch** | Stream démarré, Nouveau follower |
| **Unsplash** | Nouvelle image random du jour |

### Réactions (Conséquences)
| Service | Réactions disponibles |
|---------|----------------------|
| **Discord** | Envoyer un message |
| **Dropbox** | Créer un fichier, Upload |
| **GitHub** | Créer une issue |
| **Spotify** | Ajouter à une playlist, sauvegarder le podcast, sauvegarder le concert |
| **Unsplash** | Télécharger une image aléatoire |

---

## 📚 Documentation

Une documentation complète est disponible dans le dossier [`docs/`](./docs/) :

- 🏛️ [Architecture Web (React)](./docs/architecture/web-structure.md)
- 📊 [Benchmarks](./docs/benchmarks/introduction.md)
- 🤝 [Guide de contribution](./docs/contributing/how-to-contribute.md)

### API Documentation

Swagger UI est disponible en mode développement à l'adresse :
```
http://localhost:3000/docs
```

---

## 🤝 Contribuer

Les contributions sont les bienvenues ! Merci de lire le [guide de contribution](./docs/contributing/how-to-contribute.md) avant de commencer.

### Workflow Git

1. Créer une branche depuis `main`
   ```bash
   git checkout -b PROJ-XX-ma-feature
   ```

2. Suivre les [Conventional Commits](https://www.conventionalcommits.org/)
   ```
   feat(backend): add new authentication method
   fix(frontend): resolve routing issue
   ```

3. Créer une Pull Request avec le numéro de tâche Jira

### Standards de Code

- **TypeScript** : Utiliser Biome pour le linting et formatting
- **Kotlin** : Suivre les conventions Kotlin officielles
- **Tests** : Minimum 80% de couverture de code
- **Documentation** : Documenter toute nouvelle fonctionnalité

---

## 👥 Équipe

Projet réalisé dans le cadre du module **G-DEV-500** à **Epitech**.
- Gabriel LEVEQUE
- Aymeric BRETIN
- Lucas ANDRES
- Ewan SCHAFFHAUSER
- Alan CUNIN

---

<div align="center">

**[⬆ Retour en haut](#-area---action-reaction)**

</div>
