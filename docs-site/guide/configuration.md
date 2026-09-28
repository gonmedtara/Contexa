# Configuration

Contexai is zero-config. Optional overrides live in the **scanned project**.

## Files

| Path | Purpose |
|------|---------|
| `.contexai/lint.yaml` | Override packaged lint criteria |
| `.contexai/edit-tags.yaml` | Override edit-mode tag templates |
| Packaged `criteria/lint.yaml` | Default lint criteria (RFC 2119 / 8174) |
| Packaged `criteria/edit-tags.yaml` | Default MUST/SHOULD/XML snippets |

## Lint override example

```yaml
# .contexai/lint.yaml
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
# .contexai/edit-tags.yaml
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

Brand assets live in `brand/` and `public/` (`logo.svg`, `favicon.svg`, `favicon.ico`). Update those files to change the mark.
