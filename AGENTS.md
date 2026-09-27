# Contexa — contexte projet

Outil visuel pour gérer les fichiers de contexte IA d’un dépôt.

## Problème

Ces fichiers se dupliquent entre outils IA, dérivent avec le temps, et sont pénibles à éditer en markdown brut. Modifier ce texte a un vrai impact (poids sémantique de « must » vs « should », structure XML, redondance entre fichiers).

## Fichiers ciblés

| Type | Motifs |
|------|--------|
| `agents` | `AGENTS.md` |
| `claude` | `CLAUDE.md` |
| `ide-rule` | règles IDE `*.mdc` / `*.md` (dossier `rules` de l’éditeur) |
| `windsurf` | `.windsurfrules` |
| `skill` | `**/SKILL.md` |

## Roadmap

### Phase 1 — Scanner + éditeur lecture seule (faite)

- Scanner Nitro : parcours d’un dépôt passé en argument CLI (zéro-config → `cwd`).
- Parser : frontmatter YAML séparé du corps ; corps → AST ; sections h1/h2 navigables.
- UI lecture seule : liste des fichiers, frontmatter lisible, sections en accordéon.
- **Contrainte :** aucune écriture disque.

### Phase 2 — Moteur de linting prompt-engineering (en cours)

- Règles déterministes sur les fichiers parsés (modalité must/should, sections vides, frontmatter manquant, redondance inter-fichiers, formulations vagues, structure).
- API de lint + affichage des issues dans l’UI (toujours sans écriture).
- Architecture ouverte pour brancher d’autres règles plus tard.

### Phase 3 — Diff + écriture sécurisée via git

- Proposer des corrections, afficher un diff, écrire sur disque uniquement via un flux git maîtrisé.
- Pas d’écriture directe « silencieuse ».

### Phase 4 — Refonte visuelle

- Brief design, relooking, composants Vue (Reka UI + Tailwind), documentation de variantes (Histoire).
- Pas de système de thème avant cette phase.

## Principes d’implémentation

- Ne pas anticiper le code des phases suivantes, mais ne pas bloquer linting ni écriture (types partagés stables, scanner/parser purs).
- Lecture seule jusqu’à la Phase 3.
- Zéro configuration obligatoire au lancement.

## Commandes

```bash
npm install
npm run dev:sample
npm run dev -- /chemin/vers/depot
```

## API (Phase 1–2)

- `GET /api/context` — scan + parse (option `?repo=`).
- `GET /api/lint` — lint prompt-engineering sur le même dépôt (Phase 2).
