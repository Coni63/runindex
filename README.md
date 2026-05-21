# RunIndex

L'annuaire du coureur et du traileur — une sélection rangée des meilleurs sites pour la course à pied et le trail : matériel, marques, calendriers, chronométrage, médias, communauté.

Site en ligne : [runindex.fr](https://runindex.fr) (à venir)

## Contribuer

Toutes les suggestions sont bienvenues : nouveau site, meilleure description, correction d'un lien cassé, reclassement, nouvelle catégorie.

### Proposer un site (le plus simple)

Ouvre une [issue GitHub](../../issues/new) avec :

- **Nom du site**
- **URL**
- **Catégorie** suggérée (voir la liste plus bas)
- **Une phrase** qui décrit ce qu'il apporte
- **Quelques tags** si tu en vois (kebab-case, sans accent : `chaussures`, `trail`, `francais`…)

Pas besoin de toucher au code.

### Proposer un site par PR

Si tu connais Git :

1. Fork le repo.
2. Édite `data.json` : ajoute ton site dans le tableau `sites` de la catégorie qui va bien.
3. Ouvre une PR.

Format d'un site :

```json
{
  "id": "kebab-case-unique-dans-la-categorie",
  "name": "Nom affiché",
  "url": "https://...",
  "description": "Une phrase de présentation.",
  "tags": ["tag1", "tag2"]
}
```

Règles à respecter :

- **`id` stable** : il sert d'URL (`#/site/<cat>/<id>`). Une fois en place, ne le renomme pas — tu casses les liens externes.
- **Ranking = ordre du tableau.** Position 0 = #1. Pour reclasser, réordonne le tableau `sites`. Pas de champ `rank` à écrire.
- **Tags** en kebab-case, sans accent, ASCII (`francais` pas `français`).
- **Pas de doublon d'URL** : vérifie que le site n'est pas déjà ailleurs avant d'ajouter.

### Proposer une nouvelle catégorie

Ajoute un objet au tableau `categories` de `data.json` :

```json
{
  "id": "kebab-case-unique",
  "name": "Affiché",
  "icon": "🏃",
  "description": "Phrase courte sous le titre",
  "sites": []
}
```

Rien d'autre à toucher : le site la prend en compte automatiquement.

### Catégories actuelles

`materiel`, `marques`, `calendriers`, `chronometrage`, `voyages`, `goodies`, `blogs-reviews`, `medias`, `communaute`, `entrainement`.

## Tester en local

Le site charge `data.json` via `fetch` — il faut un serveur HTTP, pas un `file://` :

```bash
python3 -m http.server 8000
```

Puis ouvre http://localhost:8000/.

## Stack

HTML / CSS / JS vanilla, aucun build, aucune dépendance. Routing SPA par hash. Déploiement GitHub Pages : un push sur `main` met le site à jour.

Voir [`CLAUDE.md`](./CLAUDE.md) pour la documentation technique complète.

## Licence

À définir.
