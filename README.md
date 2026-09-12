# Rex — Plateforme de gestion

Front-end de la plateforme de gestion pour **Rex** (logistique et dédouanement) :
clients, dossiers de dédouanement, devis, facturation et pilotage.

Développé **avant le backend** : l'application tourne aujourd'hui sur un jeu de
données de démonstration et bascule sur l'API réelle par une seule variable
d'environnement, sans toucher au code.

## Démarrer

```bash
npm install
npm run dev
```

L'application est servie sur <http://localhost:5173>.

| Commande | Effet |
| --- | --- |
| `npm run dev` | Serveur de développement avec rechargement à chaud |
| `npm run build` | Vérification des types puis build de production dans `dist/` |
| `npm run preview` | Sert le build de production localement |
| `npm run typecheck` | Vérifie les types sans produire de fichiers |

## Socle technique

- **Vue 3** (Composition API, `<script setup>`) — runtime léger, composants monofichiers
- **Vite 6** — démarrage instantané, build optimisé
- **TypeScript** en mode `strict`
- **Vue Router** — vues chargées à la demande
- **Pinia** — état partagé

Aucune bibliothèque d'interface ni de graphiques : le design system et les
visualisations sont écrits sur mesure, en SVG. Cela évite d'embarquer plusieurs
centaines de kilo-octets pour trois graphiques, et garde la main sur le rendu.

## Brancher le backend

Tant que `VITE_API_BASE_URL` est vide, `src/api/http.ts` sert les données de
`src/api/mock`. Un bandeau le rappelle en haut de l'application.

```bash
cp .env.example .env
# puis renseigner :
VITE_API_BASE_URL=https://api.rex.ht
```

Au redémarrage, tous les appels partent vers le vrai backend. **Aucun composant
ni store ne change** : ils passent tous par `src/api/endpoints/index.ts`.

### Endpoints attendus

`src/api/mock/index.ts` fait office de cahier des charges de l'API. Le backend
doit exposer, en JSON :

| Méthode | Chemin | Réponse |
| --- | --- | --- |
| `GET` | `/moi` | `Utilisateur` |
| `GET` | `/dashboard` | `Dashboard` |
| `GET` | `/dossiers` | `Paginated<Dossier>` |
| `GET` | `/dossiers/:id` | `Dossier` |
| `GET` | `/clients` | `Paginated<Client>` |
| `GET` | `/clients/:id` | `Client` |
| `GET` | `/factures` | `Paginated<Facture>` |
| `GET` | `/devis` | `Paginated<Devis>` |
| `GET` | `/paiements` | `Paginated<Paiement>` |
| `GET` | `/prospects` | `Paginated<Prospect>` |

Les formes exactes sont dans `src/types/index.ts`. Toute divergence entre l'API
et ces types sera signalée par `npm run typecheck`, avant la mise en production.

Les listes acceptent les paramètres `recherche`, `statut`, `type` et `page`.

## Déploiement

Le projet est configuré pour **Vercel** (`vercel.json`) : build `npm run build`,
dossier de sortie `dist/`.

La réécriture `/(.*) → /index.html` est indispensable : sans elle, ouvrir ou
recharger directement `/dossiers` renvoie un 404, le routage étant assuré côté
navigateur par Vue Router en mode `history`. Vercel sert les fichiers présents
sur le disque avant d'appliquer les réécritures, donc `dist/assets/` n'est pas
affecté.

Renseignez `VITE_API_BASE_URL` dans les variables d'environnement du projet
Vercel le jour où le backend est en ligne.

### Attention aux types Node

`vite.config.ts` importe `node:url` et a donc besoin de `@types/node`. Le
typage est séparé en deux projets TypeScript :

- `tsconfig.app.json` — `src/`, types `vite/client` uniquement
- `tsconfig.node.json` — `vite.config.ts`, types `node` uniquement

Cette séparation évite que les globales Node (`process`, `Buffer`, `__dirname`)
deviennent visibles depuis le code de l'application, où elles n'existent pas à
l'exécution dans le navigateur.

## Organisation

```
src/
  api/
    http.ts            Couche d'accès — bascule démo ↔ backend
    endpoints/         Fonctions typées appelées par l'application
    mock/              Données de démonstration (disparaissent avec le backend)
  assets/styles/
    tokens.css         Toutes les couleurs, pour les deux thèmes
    base.css           Reset et primitives partagées
  components/
    layout/            Sidebar, barre du haut, bascule de thème
    ui/                Icônes, cartes KPI, étiquettes de statut
    charts/            Ruban de flux, aires empilées, anneau
  composables/         Thème, formatage (montants, dates, variations)
  stores/              Pinia : dashboard, dossiers, interface
  types/               Modèle métier — contrat avec le backend
  views/               Une vue par route
```

## Thèmes

Deux thèmes, sombre et clair. Le choix se fait par le bouton soleil/lune de la
barre du haut.

- Par défaut, l'application suit la préférence système.
- Un clic enregistre le choix (`localStorage`) et prend le pas sur le système.
- Le thème est résolu dans `index.html`, **avant le premier rendu** : pas de
  flash de couleur au chargement.

Toutes les couleurs viennent de `tokens.css`. Le thème clair n'est qu'une
redéfinition des mêmes jetons — les deux thèmes ne peuvent pas diverger.

## État d'avancement

**Écrans développés** — tableau de bord, liste des dossiers (avec filtres),
détail d'un dossier, clients, factures, devis.

**Écrans prévus, non développés** — marchandises, documents, prospects, portail
client, paiements, débours, rapports, notifications, journal d'activité. Ils
affichent un écran d'attente qui rappelle leur phase de livraison.

**Non implémenté** — authentification, écritures (création et modification),
génération des PDF, envoi des e-mails. Ces fonctions dépendent du backend.

## À savoir

Les données affichées sont **fictives** : noms de clients, références de
dossiers, montants et utilisateur connecté. Elles servent à valider les écrans
et disparaîtront au branchement de l'API.

Le logo est un monogramme provisoire, à remplacer par celui de Rex.
