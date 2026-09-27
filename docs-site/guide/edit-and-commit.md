# Edit mode

1. Open a file in the UI
2. Click **Edit**
3. Use tags grouped by category:
   - **Frontmatter** — insert / update YAML keys (`description`, `name`, `globs`, `applyTo`, …)
   - **Modality** — MUST / SHOULD / MAY (RFC 2119)
   - **XML blocks** — `<rules>`, `<examples>`, …
4. Adapt the text
5. Review the **Diff preview**
6. Click **Save** — writes to disk and **reloads lint + file view**

There is no built-in git commit step. Commit with your own git workflow after saving.
