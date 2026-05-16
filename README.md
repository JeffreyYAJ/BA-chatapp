# SecureChat (React & Node.js) - Chat en Temps Réel Chiffré

## Description du projet
SecureChat est une application web full-stack de messagerie instantanée. Elle permet à plusieurs utilisateurs de communiquer en temps réel dans un salon commun. 
L'application implémente un véritable chiffrement de bout en bout (End-to-End Encryption) : les messages sont chiffrés en **AES** directement dans le navigateur (React) avant d'être envoyés au serveur (Node.js). Le serveur n'est qu'un relais et ne peut jamais lire les messages en clair.

### Fonctionnalités implémentées :
- [x] Application Single Page (React).
- [x] Choix du pseudonyme au démarrage.
- [x] Envoi et affichage de messages en temps réel (via Socket.IO).
- [x] Chiffrement AES côté client avec `crypto-js`.
- [x] Commande `/quit` pour quitter proprement.
- [x] Notifications automatiques de connexion et déconnexion.

---

## Installation locale

Prérequis : Node.js installé sur votre machine.

### 1. Lancer le serveur (Backend)
Dans un terminal :
```bash
cd server
npm install
node server.js
```

### 2. Lancer l'interface (Frontend)

```bash
cd client
npm install 
npm run dev
```

`L'application sera accessible sur le port fourni par Vite (généralement http://localhost:5173)`


### Lien public de l'application
Le projet est déployé gratuitement et accessible 24h/24 (maintenu actif via UptimeRobot) :

- Lien de l'application (Interface) :  [LIEN VERCEL]

- Lien du serveur WebSockets : [LIEN RENDER]

