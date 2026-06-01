# 📖 Documentation Technique — Laborex Burkina : Système de Suivi Documentaire

> **Projet** : `laborex-system` (v3.0.0)  
> **Type** : Application web frontend (SPA)  
> **Stack** : React 18 + Vite + Material UI 5 + Redux Toolkit  
> **Backend** : Django REST Framework (hébergé sur Render)  
> **Dernière mise à jour** : Juin 2026

---

## 📋 Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Stack technique](#2-stack-technique)
3. [Architecture du projet](#3-architecture-du-projet)
4. [Arborescence des fichiers](#4-arborescence-des-fichiers)
5. [Configuration et environnement](#5-configuration-et-environnement)
6. [Système de routage](#6-système-de-routage)
7. [Authentification et sécurité](#7-authentification-et-sécurité)
8. [Gestion d'état (Redux)](#8-gestion-détat-redux)
9. [Modules métier](#9-modules-métier)
10. [Scripts et commandes](#10-scripts-et-commandes)
11. [Endpoints API utilisés](#11-endpoints-api-utilisés)

---

## 1. Vue d'ensemble

L'application **Laborex Burkina — Suivi Documentaire** est une plateforme de gestion documentaire dédiée aux opérations de transit de Laborex Burkina Faso. Elle permet aux agents de transit, chefs de service et administrateurs (RSI) de :

- **Gérer les dossiers BEX** (Bordereaux d'Entrée en X) — maritime, aérien, local
- **Suivre les ADI** (Autorisations de Dédouanement à l'Importation)
- **Contrôler les CCPQ** (Certificats de Conformité et de Qualité)
- **Visualiser les KPI** via un tableau de bord analytique avec graphiques Chart.js
- **Importer des données en masse** depuis des fichiers Excel
- **Administrer les utilisateurs** et les paramètres système

### Rôles utilisateur

| Rôle | Code | Permissions |
|------|------|-------------|
| Agent de Transit | `AGENT` | CRUD sur ses propres dossiers, vue filtrée du dashboard |
| Chef de Service | `CHEF_SERVICE` | Validation des BEX, vue globale du dashboard |
| Administrateur RSI | `ADMIN` | Accès total, gestion utilisateurs, paramètres système |

---

## 2. Stack technique

### Frontend

| Technologie | Version | Rôle |
|---|---|---|
| **React** | 18.3 | Framework UI |
| **Vite** | 5.2 | Bundler / Dev Server |
| **Material UI (MUI)** | 5.15 | Bibliothèque de composants UI |
| **Redux Toolkit** | 2.2 | Gestion d'état globale |
| **React Router** | 6.23 | Routage SPA |
| **Axios** | 1.16 | Client HTTP |
| **Chart.js + react-chartjs-2** | 4.5 / 5.3 | Graphiques (Bar, Pie, Line) |
| **Formik + Yup** | 2.4 / 1.4 | Formulaires et validation |
| **Framer Motion** | 11.1 | Animations |
| **SweetAlert2** | 11.26 | Notifications stylisées |
| **js-cookie** | 3.0 | Gestion des cookies (CSRF) |
| **SCSS** | — | Styles globaux |

### Backend (externe)

- **Django REST Framework** hébergé sur `https://gestion-suivi-documentaire.onrender.com`
- Authentification par **session + CSRF token**
- API REST sous le préfixe `/api/`

---

## 3. Architecture du projet

### Flux d'initialisation

```
index.html
  └── src/index.jsx
        ├── Redux Provider (store)
        ├── BrowserRouter
        ├── AuthProvider (contexte auth)
        └── App.jsx
              ├── ThemeProvider (MUI)
              └── Routes
                    ├── AuthenticationRoutes (MinimalLayout)
                    │     ├── / → Landing Page
                    │     ├── /login → Login
                    │     └── /register → Register
                    └── MainRoutes (ProtectedRoute → MainLayout)
                          ├── Header (logo, recherche, profil, notifications)
                          ├── Sidebar (menu dynamique)
                          └── Outlet → Vues (Dashboard, Transit, Admin)
```

### Flux de données

```
Utilisateur → Composant React → api/index.js (Axios) → Backend Django
                                      ↑
                              CSRF Token (cookie)
                              Session Auth (cookie)
```

---

## 4. Arborescence des fichiers

### Racine du projet

| Fichier | Description |
|---------|-------------|
| `.env` | Variables d'environnement de développement |
| `.env.qa` | Variables d'environnement QA/staging |
| `.eslintrc` | Configuration ESLint |
| `.prettierrc` | Configuration Prettier |
| `index.html` | Point d'entrée HTML (Vite) |
| `package.json` | Dépendances et scripts npm |
| `vite.config.mjs` | Configuration Vite (proxy, port, plugins) |
| `jsconfig.json` | Alias de chemins pour imports absolus |
| `vercel.json` | Configuration de déploiement Vercel |
| `favicon.svg` | Icône du site |

### `src/` — Fichiers racine

| Fichier | Description |
|---------|-------------|
| `index.jsx` | Point d'entrée React — Monte l'application dans le DOM avec Redux Provider, BrowserRouter et AuthProvider |
| `config.js` | Constantes globales : `gridSpacing` (3), `drawerWidth` (280px), mode thème (`light`) |
| `menu-items.jsx` | Définition de la navigation sidebar : 3 groupes (Navigation, Module Transit, Administration) avec icônes MUI |
| `serviceWorker.js` | Service Worker pour PWA (actuellement désactivé) |
| `vite-env.d.js` | Déclarations de types pour les variables d'environnement Vite |

### `src/api/`

| Fichier | Description |
|---------|-------------|
| `index.js` | Instance Axios configurée avec `withCredentials`, intercepteur CSRF pour les requêtes POST/PATCH/DELETE, intercepteur de réponse qui extrait `response.data` et normalise les erreurs |

### `src/context/`

| Fichier | Description |
|---------|-------------|
| `AuthContext.jsx` | Contexte React fournissant : `user`, `loading`, `error`, `login()`, `logout()`, `isAdmin`. Vérifie la session au montage via `GET /api/me/` |

### `src/store/`

| Fichier | Description |
|---------|-------------|
| `actions.js` | Constantes d'actions Redux : `LOGIN`, `LOGOUT`, `MENU_OPEN`, `MENU_TYPE` |
| `reducer.js` | Root reducer utilisant `combineReducers` avec le reducer de personnalisation |
| `customizationReducer.js` | Gère l'état de l'interface : menu actif (`isOpen`) et type de navigation (`navType`) |

### `src/themes/`

| Fichier | Description |
|---------|-------------|
| `index.jsx` | Création du thème MUI personnalisé avec `createTheme` — palette de couleurs, typographie Poppins, styles de composants (List, Paper, Card, etc.), breakpoints personnalisés |

### `src/routes/`

| Fichier | Description |
|---------|-------------|
| `index.jsx` | Agrège toutes les routes avec `useRoutes([AuthenticationRoutes, MainRoutes])` |
| `AuthenticationRoutes.jsx` | Routes publiques (Landing, Login, Register) avec `MinimalLayout` |
| `MainRoutes.jsx` | Routes protégées (Dashboard, Transit, Admin) avec `ProtectedRoute` → `MainLayout`. Utilise le lazy loading pour toutes les vues |

### `src/layout/`

| Fichier | Description |
|---------|-------------|
| `App.jsx` | Composant racine : enveloppe l'application avec `ThemeProvider`, `StyledEngineProvider`, `CssBaseline` et `NavigationScroll` |
| `NavigationScroll.jsx` | Scroll automatique vers le haut lors de la navigation |
| `MainLayout/index.jsx` | Layout principal avec AppBar fixe, Sidebar persistante (desktop) ou temporaire (mobile), zone de contenu avec `Outlet` |
| `MainLayout/Header/index.jsx` | Barre d'en-tête : logo "LABOREX", bouton menu, recherche, notifications, profil |
| `MainLayout/Header/ProfileSection/` | Menu déroulant du profil utilisateur |
| `MainLayout/Header/NotificationSection/` | Section notifications |
| `MainLayout/Header/SearchSection/` | Barre de recherche |
| `MainLayout/Header/MobileSection/` | Menu mobile responsive |
| `MainLayout/Sidebar/index.jsx` | Drawer latéral avec `PerfectScrollbar` et `MenuList` dynamique. Persistant en desktop (lg+), temporaire en mobile |
| `MainLayout/Sidebar/MenuList/` | Rendu dynamique du menu à partir de `menu-items.jsx` |
| `MinimalLayout/index.jsx` | Layout minimal sans sidebar ni header (pages publiques) |

### `src/component/`

| Fichier | Description |
|---------|-------------|
| `Loadable.jsx` | HOC qui enveloppe un composant lazy avec `Suspense` et un loader (`LinearProgress`) |
| `ProtectedRoute.jsx` | Garde de route : vérifie l'authentification, affiche un spinner pendant le chargement, redirige vers `/login` si non connecté, supporte le mode `adminOnly` |
| `Breadcrumb/index.jsx` | Composant fil d'Ariane |
| `Loader/Loader.jsx` | Barre de progression linéaire fixe en haut de page |

### `src/views/Landing/`

| Fichier | Description |
|---------|-------------|
| `index.jsx` | Page d'accueil publique avec : AppBar sticky, hero section avec gradient et image, 3 cartes features (BEX, ADI/CCPQ, Sécurité RSI), section CTA, footer |

### `src/views/Login/`

| Fichier | Description |
|---------|-------------|
| `index.jsx` | Page de connexion : Card centrée avec logo LABOREX et lien vers l'inscription |
| `AuthLogin.jsx` | Formulaire de connexion Formik + Yup : champs username/password, toggle visibilité, validation, appel `login()` du contexte, redirection vers dashboard |

### `src/views/Register/`

| Fichier | Description |
|---------|-------------|
| `index.jsx` | Page d'inscription : Card centrée similaire au login |
| `AuthRegister.jsx` | Formulaire d'inscription avec bouton Google, champs email/password, checkbox conditions |

### `src/views/Dashboard/`

| Fichier | Description |
|---------|-------------|
| `Default/index.jsx` | **Tableau de bord principal** (~800 lignes) — Affiche 4 cartes KPI animées (Framer Motion), barre de filtres (période, type, agent), 3 graphiques Chart.js (barres groupées, camembert, ligne de tendance), tableau des dossiers en retard SLA, export Excel. Inclut un mode "bac à sable" avec données simulées si l'API est indisponible |
| `AnalyticsDashboard.jsx` | Version alternative/duplicate du dashboard analytique avec la même structure |
| `Default/ReportCard/` | Composant carte de rapport réutilisable |
| `Default/SupportRequestCard/` | Composant carte de demande de support |
| `card/RevenuChartCard.jsx` | Composant graphique de revenus (ApexCharts) |
| `card/SalesLineCard.jsx` | Composant graphique de ventes |
| `card/revenu-chart.js` | Configuration du graphique de revenus |
| `card/sale-chart-1.js` | Configuration du graphique de ventes |

### `src/views/Transit/Bex/`

| Fichier | Description |
|---------|-------------|
| `index.jsx` | Liste des dossiers BEX : tableau MUI avec recherche, bouton import Excel (avec SweetAlert2 pour feedback), bouton "Nouveau BEX", validation par le Chef de Service. Gère les rôles (ADMIN ne peut pas créer) |
| `CreateBex.jsx` | Formulaire de création BEX avec Formik + Yup : N° BEX, type (Local/Maritime/Aérien/Hors BEX), fournisseur, date d'enlèvement, et lignes produits dynamiques via `FieldArray` (conteneur, désignation, quantité, facture FCFA) |
| `BexDetails.jsx` | Vue détaillée d'un dossier BEX avec toutes les informations |

### `src/views/Transit/Adi/`

| Fichier | Description |
|---------|-------------|
| `index.jsx` | Liste des dossiers ADI : tableau avec recherche, import Excel, changement de statut inline via Select (EN_ATTENTE → SOUMIS → VALIDE/REJETE) |
| `CreateAdi.jsx` | Formulaire de création d'un dossier ADI |
| `AdiDetails.jsx` | Vue détaillée d'un dossier ADI |

### `src/views/Transit/Ccpq/`

| Fichier | Description |
|---------|-------------|
| `index.jsx` | Liste des dossiers CCPQ : tableau avec recherche, import Excel, changement de statut inline (NON_DEMARRE → EN_ANALYSE → APPROUVE/REJETE) |
| `CreateCcpq.jsx` | Formulaire de création d'un dossier CCPQ |
| `CcpqDetails.jsx` | Vue détaillée d'un dossier CCPQ |

### `src/views/Admin/`

| Fichier | Description |
|---------|-------------|
| `Users/index.jsx` | Gestion des utilisateurs (réservé ADMIN) : tableau avec rôles, Dialog de création (username, password, prénom, nom, rôle), bouton de déblocage de compte |
| `Settings/index.jsx` | Configuration système : tableau éditable de paramètres clé-valeur avec sauvegarde individuelle (seuils SLA, alertes emails, etc.) |

---

## 5. Configuration et environnement

### `vite.config.mjs`

| Paramètre | Valeur | Description |
|---|---|---|
| `server.port` | `3000` | Port du serveur de développement |
| `server.open` | `true` | Ouvre le navigateur automatiquement |
| `server.proxy` | `/api → Render` | Proxy les appels API vers le backend Django |
| `base` | `VITE_APP_BASE_NAME` | Base URL de l'application |
| `plugins` | `react, jsconfigPaths` | Support React + imports absolus |

### `.env` (développement)

```env
VITE_APP_VERSION = v3.0.0
VITE_API_URL = https://gestion-suivi-documentaire.onrender.com
VITE_APP_BASE_NAME = /
```

---

## 6. Système de routage

### Routes publiques (`AuthenticationRoutes.jsx`)

| Route | Composant | Description |
|-------|-----------|-------------|
| `/` | `LandingPage` | Page d'accueil marketing |
| `/login` | `Login` | Page de connexion |
| `/register` | `Register` | Page d'inscription |

> Ces routes utilisent le `MinimalLayout` (sans sidebar ni header).

### Routes protégées (`MainRoutes.jsx`)

| Route | Composant | Description |
|-------|-----------|-------------|
| `/dashboard/default` | `DashboardDefault` | Tableau de bord principal |
| `/transit/bex` | `BexList` | Liste des dossiers BEX |
| `/transit/bex/create` | `CreateBex` | Création d'un nouveau BEX |
| `/transit/bex/:id` | `BexDetails` | Détails d'un dossier BEX |
| `/transit/adi` | `AdiList` | Liste des dossiers ADI |
| `/transit/adi/create` | `CreateAdi` | Création d'un nouvel ADI |
| `/transit/adi/:id` | `AdiDetails` | Détails d'un dossier ADI |
| `/transit/ccpq` | `CcpqList` | Liste des dossiers CCPQ |
| `/transit/ccpq/create` | `CreateCcpq` | Création d'un nouveau CCPQ |
| `/transit/ccpq/:id` | `CcpqDetails` | Détails d'un dossier CCPQ |
| `/admin/users` | `UserList` | Gestion des utilisateurs |
| `/admin/settings` | `Settings` | Paramètres système |

> Toutes ces routes sont enveloppées dans `ProtectedRoute` → redirection vers `/login` si non authentifié.

---

## 7. Authentification et sécurité

### `context/AuthContext.jsx`

Le contexte d'authentification fournit :

- **`user`** — Objet utilisateur courant (ou `null`)
- **`loading`** — État de chargement
- **`login(username, password)`** — Connexion via `POST /api/login/`
- **`logout()`** — Déconnexion via `POST /api/logout/`
- **`isAdmin`** — Booléen `user.role === 'ADMIN'`

### `api/index.js` — Client Axios

- **Base URL** : Variable d'environnement `VITE_API_URL`
- **`withCredentials: true`** : Envoi automatique des cookies de session
- **Intercepteur Request** : Ajoute le header `X-CSRFToken` pour les requêtes POST/PATCH/DELETE
- **Intercepteur Response** : Extrait `response.data`, normalise les erreurs

### `component/ProtectedRoute.jsx`

- Vérifie l'authentification via `useAuth()`
- Affiche un `CircularProgress` pendant le chargement
- Redirige vers `/login` si pas d'utilisateur
- Supporte un mode `adminOnly` pour les routes réservées

---

## 8. Gestion d'état (Redux)

Le Redux Store est principalement utilisé pour la **personnalisation de l'interface** :

- `isOpen` — Identifiant du menu actuellement sélectionné
- `navType` — Type de navigation (thème)

L'état métier (utilisateur, dossiers transit) est géré via le `AuthContext` et l'état local (`useState`) des composants.

---

## 9. Modules métier

### 9.1 Module Transit — BEX

**Bordereaux d'Entrée en X** pour le suivi des importations.

- **Statuts** : `EN_ATTENTE` → `VALIDE` → `DEDOUANE`
- **Fonctionnalités** : CRUD, import Excel, validation par le Chef, recherche

### 9.2 Module Transit — ADI

**Autorisations de Dédouanement à l'Importation**.

- **Statuts** : `EN_ATTENTE` → `SOUMIS` → `VALIDE` / `REJETE`
- **Fonctionnalités** : CRUD, import Excel, changement de statut inline

### 9.3 Module Transit — CCPQ

**Certificats de Conformité, Produits et Qualité**.

- **Statuts** : `NON_DEMARRE` → `EN_ANALYSE` → `APPROUVE` / `REJETE`
- **Fonctionnalités** : CRUD, import Excel, changement de statut inline

### 9.4 Dashboard Analytique

Le tableau de bord (`views/Dashboard/Default/index.jsx`) affiche :

| Section | Description |
|---------|-------------|
| **KPI Cards** | 4 cartes animées : Dossiers actifs, Bloqués, Taux SLA, Délais moyens |
| **Filtres** | Période, type de dossier, agent responsable |
| **Graphique barres** | Dossiers traités par type et par mois |
| **Graphique camembert** | Causes et facteurs de retards |
| **Graphique ligne** | Tendance hebdomadaire des délais moyens |
| **Tableau retards** | Dossiers hors SLA avec navigation vers détails |
| **Export Excel** | Téléchargement du rapport analytique |
| **Mode Sandbox** | Données simulées si l'API est indisponible |

### 9.5 Administration

- **Utilisateurs** : Liste, création, déblocage (réservé ADMIN)
- **Paramètres** : Configuration clé-valeur du système

---

## 10. Scripts et commandes

```bash
# Démarrer le serveur de développement (port 3000)
npm run start

# Build de production
npm run build

# Build pour l'environnement QA
npm run build-stage

# Prévisualiser le build
npm run preview

# Linter
npm run lint
npm run lint:fix

# Formattage du code
npm run prettier

# Déploiement GitHub Pages
npm run deploy
```

---

## 11. Endpoints API utilisés

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/me/` | Profil utilisateur courant |
| `POST` | `/api/login/` | Connexion |
| `POST` | `/api/logout/` | Déconnexion |
| `GET/POST` | `/api/transit/bex/` | Liste / Créer un BEX |
| `POST` | `/api/transit/bex/:id/valider/` | Valider un BEX |
| `POST` | `/api/transit/bex/import-excel/` | Import Excel BEX |
| `GET/POST` | `/api/transit/adi/` | Liste / Créer un ADI |
| `PATCH` | `/api/transit/adi/:id/` | Mettre à jour statut ADI |
| `POST` | `/api/transit/adi/import-excel/` | Import Excel ADI |
| `GET/POST` | `/api/transit/ccpq/` | Liste / Créer un CCPQ |
| `PATCH` | `/api/transit/ccpq/:id/` | Mettre à jour statut CCPQ |
| `POST` | `/api/transit/ccpq/import-excel/` | Import Excel CCPQ |
| `GET` | `/api/analytics/dashboard-data/` | Données du tableau de bord |
| `GET` | `/api/analytics/export-excel/` | Export rapport Excel |
| `GET/POST` | `/api/users/` | Liste / Créer un utilisateur |
| `POST` | `/api/users/unlock/` | Débloquer un utilisateur |
| `GET` | `/api/settings/` | Liste des paramètres |
| `PATCH` | `/api/settings/:id/` | Modifier un paramètre |

---

> **Note** : Ce projet est basé sur le template *Materially Free React Admin* de CodedThemes, fortement personnalisé pour les besoins métier de Laborex Burkina Faso.
