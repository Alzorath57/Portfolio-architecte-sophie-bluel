# Portfolio de Sophie Bluel — architecte d'intérieur

Site portfolio d'une architecte, rendu dynamique en **JavaScript vanilla** (sans framework) grâce à des appels à une API REST.

> Projet réalisé pendant la formation Développeur Web d'OpenClassrooms (2026). Le back-end (Node.js, Express, SQLite) était **fourni** par OpenClassrooms : mon travail porte sur tout le front-end, dans le dossier `FrontEnd/`.

## Fonctionnalités

- **Galerie dynamique** : les projets sont récupérés depuis l'API avec `fetch` et affichés sans rechargement de la page.
- **Filtres par catégorie**, générés à partir des catégories renvoyées par l'API.
- **Connexion** : formulaire de login, token JWT conservé dans le `localStorage`, message d'erreur en cas d'identifiants incorrects, bouton « logout ».
- **Mode édition** (utilisateur connecté) : bannière « Mode édition », filtres masqués, accès à la modale d'administration.
- **Modale d'administration** :
  - suppression d'un projet, mise à jour immédiate de la galerie,
  - ajout d'un projet avec aperçu de l'image avant envoi,
  - bouton « Valider » désactivé tant que le formulaire n'est pas complet,
  - formulaire réinitialisé à la fermeture de la modale.

## Organisation du code

Le JavaScript est découpé en **9 modules ES6**, chacun avec une responsabilité précise :

| Module | Rôle |
|---|---|
| `script.js` | Point d'entrée, initialisation de la page |
| `state.js` | État partagé : projets, token, catégorie active, URL de l'API |
| `api.js` | Tous les appels à l'API (`fetch`) |
| `gallery.js` | Affichage de la galerie |
| `filters.js` | Création et gestion des filtres |
| `auth.js` | Gestion de l'état connecté / déconnecté |
| `login.js` | Formulaire de connexion |
| `modal.js` | Ouverture, fermeture et navigation de la modale |
| `form.js` | Formulaire d'ajout de projet et aperçu de l'image |

## Technologies

HTML5, CSS3, JavaScript ES6+ (modules, `async`/`await`, `fetch`), API REST, JWT.

## Installation

Prérequis : Node.js et l'extension **Live Server** de VS Code (ou tout autre serveur local).

### 1. Lancer le back-end

```bash
git clone https://github.com/Alzorath57/Portfolio-architecte-sophie-bluel.git
cd Portfolio-architecte-sophie-bluel/Backend
npm install
npm start
```

L'API est disponible sur `http://localhost:5678`, et sa documentation Swagger sur `http://localhost:5678/api-docs/`.

### 2. Lancer le front-end

Ouvrir `FrontEnd/index.html` avec Live Server.

### Compte de test

| E-mail | Mot de passe |
|---|---|
| sophie.bluel@test.tld | S0phie |

## Auteur

**Julien Holtzinger** — développeur web junior
[Portfolio](https://julien-holtzinger.vercel.app/) · [GitHub](https://github.com/Alzorath57)
