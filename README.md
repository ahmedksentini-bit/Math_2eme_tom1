# Maths 2ème — Tome 1

Application web statique et PWA d’exercices paramétriques alignés sur le manuel CNP *Mathématiques, 2ème année de l’enseignement secondaire* (sections Sciences et Technologie de l’informatique), tome 1.

## Architecture

- `data/exercises.json` : chapitres et premier lot d’exercices ;
- `data/exercises-ch1-ch4.json`, `data/exercises-ch5-ch9.json` : lots suivants ;
- `src/solvers.js` : calculs et corrections pas à pas ;
- `src/app.js` : moteur générique et interface ;
- `src/recaps.js` : rappel de cours affiché à gauche de chaque exercice ;
- `src/diagrams.js` : figures de cours, une par situation ;
- `sw.js` et `manifest.webmanifest` : installation et fonctionnement hors connexion ;
- `tests/` : contrôles numériques des solveurs.

Pour ajouter un exercice, déclarer son contenu dans le JSON puis associer un solveur. Aucun framework ni compilation n’est nécessaire pour Cloudflare Pages.

## Développement

```text
npm test
npm run serve
```

Le dossier de sortie Cloudflare Pages reste la racine `/` et la commande de build reste vide.
