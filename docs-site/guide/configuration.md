# Configuration

Contexa is zero-config. Optional overrides live in the **scanned project**.

## Files

| Path | Purpose |
|------|---------|
| `.contexa/lint.yaml` | Override packaged lint criteria |
| `.contexa/edit-tags.yaml` | Override edit-mode tag templates |
| Packaged `criteria/lint.yaml` | Default lint criteria (RFC 2119 / 8174) |
| Packaged `criteria/edit-tags.yaml` | Default MUST/SHOULD/XML snippets |

## Lint override example

```yaml
# .contexa/lint.yaml
rules:
  - id: vague-language
    enabled: false
  - id: modality-signals
    shouldToMustRatioWarning: 3
    mustPatterns:
      - "\\b(must|shall|required)\\b"
```

Rules merge by `id` with the package defaults.

## Edit tags override example

```yaml
# .contexa/edit-tags.yaml
tags:
  - id: xml-safety
    label: "<safety>"
    category: xml
    description: Safety constraints block
    snippet: |
      <safety>
      - …
      </safety>
```

## Branding

Replace `public/logo.svg` in the Contexa package (or fork) when you have a final logo. No theme redesign is required.
