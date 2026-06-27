# Run Catalog

Annuaire de sites pour la course à pied et le trail. SPA statique, données en JSON commit dans le repo, déploiement prévu sur GitHub Pages (domaine cible : `Run Catalog.fr`).

## Stack

- HTML / CSS / JS vanilla, aucun build, aucune dépendance.
- Routing SPA par hash (`window.location.hash`), compatible GitHub Pages sans config serveur.
- Données dans `data.json`, chargées via `fetch` au démarrage.

## Fichiers

| Fichier      | Rôle                                                                 |
|--------------|----------------------------------------------------------------------|
| `index.html` | Squelette + `<template>` pour chaque vue (home, catégorie, détail site, recherche). |
| `style.css`  | Thème sombre, variables CSS dans `:root`, layout responsive.         |
| `app.js`     | IIFE : chargement data, router hash, rendu via templates clonés.     |
| `data.json`  | Source unique de vérité : métadonnées site + catégories + sites.     |

## Modèle de données

```jsonc
{
  "site":   { "title", "tagline", "intro" },
  "categories": [
    {
      "id":   "kebab-case-unique",
      "name": "Affiché",
      "icon": "emoji",
      "description": "Phrase courte sous le titre",
      "sites": [
        {
          "id":   "kebab-case-unique-dans-la-categorie",
          "name": "Affiché",
          "url":  "https://...",
          "description": "Phrase de présentation",
          "tags": ["tag1", "tag2"]
        }
      ]
    }
  ]
}
```

**Le ranking est l'ordre du tableau `sites`.** Position 0 = #1. Pas de champ `rank` en data — il est calculé à l'affichage. Pour reclasser, réordonner le tableau.

Les `id` doivent rester stables : ils servent d'URL (`#/c/<cat>/`, `#/site/<cat>/<site>`). Renommer un `id` casse les liens externes.

## Routes (hash)

- `#/` — home : layout complet, tous les panneaux de catégories avec leurs sites.
- `#/c/<cat-id>` — vue catégorie isolée (deep-link, breadcrumb).
- `#/site/<cat-id>/<site-id>` — page descriptive d'un site.
- `#/search/<query>` — résultats de recherche (lance auto via l'input).

## Comportements UI à connaître

- **Home limit** : constante `HOME_LIMIT = 6` dans `app.js`. Au-delà, les lignes excédentaires reçoivent la classe `.extra` (cachées par CSS) et un bouton `Voir plus (N) / Voir moins` est injecté.
- **Recherche** : input dans le header, debounced 200 ms, match sur `name + description + tags + nom de catégorie`.
- **Layout home** : masonry vertical en CSS columns (`column-width: 380px` sur `.categories-layout`, `break-inside: avoid` sur `.category-panel`). Les panneaux remplissent la colonne du haut vers le bas sans aligner les hauteurs ; le nombre de colonnes s'adapte tout seul à la largeur de l'écran. `.container` est élargi à 1800px pour la home, les autres vues (hero, breadcrumb, catégorie isolée, détail site, recherche) sont contraintes à 960px pour rester lisibles.

## Catégories actuelles

`materiel`, `marques`, `calendriers`, `chronometrage`, `voyages`, `goodies`, `blogs-reviews`, `medias`, `communaute`, `entrainement`.

Ajouter une catégorie = ajouter un objet au tableau `categories` de `data.json`. Rien d'autre à toucher.

## Conventions

- Ne pas introduire de framework / bundler tant que le besoin n'est pas justifié — la simplicité fait partie du projet.
- Pas de commentaires dans le code sauf si le *pourquoi* n'est pas évident.
- Tags en kebab-case, sans accent, ASCII (`francais` pas `français`) — ils sont utilisés en recherche et potentiellement comme classe CSS plus tard.
- Toute modif de contenu = édition de `data.json` uniquement, jamais de string en dur dans `index.html` ou `app.js`.

## Pour tester localement

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000/
```

`fetch('data.json')` exige un serveur HTTP — ouvrir `index.html` en `file://` ne marche pas.
