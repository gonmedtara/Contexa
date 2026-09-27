# Roadmap Contexa

Document de suivi des étapes. Mettre à jour le statut à chaque phase livrée.

| Phase | Objectif | Statut |
|-------|----------|--------|
| 1 | Scanner + parser + UI lecture seule | Fait |
| 2 | Moteur de linting prompt-engineering | Fait |
| 3 | Diff + écriture sécurisée via git | À faire |
| 4 | Refonte visuelle (design system, Histoire) | À faire |

## Phase 1 — détail

1. Scaffold Nuxt + TypeScript.
2. Types partagés + scanner serveur.
3. Parser frontmatter / AST / sections.
4. API `GET /api/context` + CLI repo.
5. UI lecture seule (liste, frontmatter, accordéon).

## Phase 2 — détail

1. Types `LintIssue` / `LintResult` + registre de règles.
2. Règles initiales (modalité, structure, redondance, frontmatter, vague).
3. API `GET /api/lint`.
4. Affichage des issues dans l’UI (par fichier / global).

## Phase 3 — détail (non démarrée)

1. Propositions de fix liées aux issues.
2. Diff unifié avant écriture.
3. Commit / écriture uniquement via git.

## Phase 4 — détail (non démarrée)

1. Brief design.
2. Migration UI (Reka UI + Tailwind).
3. Documentation de variantes.
