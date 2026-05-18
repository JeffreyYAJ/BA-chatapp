# YAJChat — Matrix Edition

YAJChat est une application de messagerie instantanée en temps réel. Développée avec une esthétique typée "Terminal Matrix", elle implémente un chiffrement symétrique de bout en bout afin de garantir que le serveur de relais ne puisse jamais lire le contenu des échanges.

## ] Fonctionnalités

- **Interface Cypherpunk** : UI inspirée des terminaux Linux/Matrix .
- **Temps Réel** : Communication bidirectionnelle via WebSockets.
- **Chiffrement AES-256** : Sécurisation des charges utiles avant transmissio
- **Commandes Terminal** : Support de `/quit` pour quitter proprement le salon comme reqis.
- **CI/CD & Haute Disponibilité** : Pipeline GitHub Actions pour le déploiement continu et script anti-veille automatique sur les serveurs de deploiement.

---

## Architecture Cryptographique & Implémentation

### 1. L'Algorithme : AES (Advanced Encryption Standard)

Le projet utilise l'algorithme **AES**, une norme de chiffrement symétrique par blocs .

Dans notre configuration avec la bibliothèque `crypto-js`, nous utilisons une **clé secrète partagée**.

### 2. Mécanisme de dérivation et formatage

Le code utilise une simple chaîne de caractères comme clé, cependant `crypto-js` effectue des opérations de durcissement en arrière-plan :

- **KDF (Key Derivation Function)** : À chaque chiffrement, `crypto-js` génère un **sel** aléatoire et utilise une fonction de dérivation pour générer la véritable clé AES de 256 bits.
- **Format OpenSSL** : Le message chiffré final exporté en chaîne de caractères respecte le standard OpenSSL. Il commenxe par la signature `Salted_` en binaire, suivie du sel, puis du texte chiffré (_ciphertext_), le tout encodé en **Base64**.

#### Code Source du Chiffrement (`cryptoUtils.js`) :

```javascript
// Chiffrement côté client avant l'émission WebSocket
export const encryptMessage = (text) => {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};
```

#### Code Source du Déchiffrement (`cryptoUtils.js`) :

JavaScript

```
// Déchiffrement côté client à la réception du flux
export const decryptMessage = (cipherText) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
```

## Stack Technique

- **Frontend** : React.js (via Vite), CSS3 (Style Terminal).
- **Backend** : Node.js, Express, Socket.IO.
- **Cryptographie** : Crypto-JS

## Installation et Utilisation Locale

### Prérequis

- Node.js
- npm

### 1. Cloner le projet

```bash
git clone git@github.com:JeffreyYAJ/BA-chatapp.git
cd BA-chatapp
```

### 2. Lancer le Serveur (Backend)

```bash
cd server
npm install
node server.js
```

_Le serveur écoutera sur le port `3001`._

### 3. Lancer le Client (Frontend)

```bash
cd ../client
npm install
npm run dev
```

_L'application sera accessible sur `http://localhost:5173`._

## Infrastructure DevOps & Déploiement Continues

- **Frontend** : Hébergé sur **Vercel** .
- **Backend** : Hébergé sur **Render** (gestion native des connexions persistantes WebSockets).
- **CI/CD** : Géré par **GitHub Actions** (`.github/workflows/deploy.yml`) pour notifier l'infrastructure à chaque mise à jour de la branche principale (`main`).
- **Résilience (Anti-Sleep)** : Les instances gratuites de Render s'endorment après 15 minutes d'inactivité. Un workflow cron automatisé GitHub Actions (`keep-alive.yml`) envoie un paquet _ping_ (via `curl`) toutes les 10 minutes pour maintenir le serveur éveillé H24, garantissant une disponibilité immédiate lors de la correction.
