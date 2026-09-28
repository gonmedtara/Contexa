# Roadmap

Planned next steps for Contexai (not shipped yet).

Source and package: [GitHub](https://github.com/gonmedtara/Contexai) · [npm](https://www.npmjs.com/package/contexai)

## AI-assisted lint

Today, linting is rule-based (`criteria/lint.yaml` / `.contexai/lint.yaml`).

Next: optional **AI lint** that reviews context files for clarity, contradictions, missing obligations, and prompt quality — on top of the existing deterministic rules.

## Share context across projects

Context files are useful beyond a single repo. Next: practical ways to **reuse and share** the same agents, prompts, instructions, and skills across multiple projects (for example team packs, linked folders, or publishable context packages).

Exact packaging and sync model is still open; the goal is one source of truth that several repositories can consume without copy-paste drift.
