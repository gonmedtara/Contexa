---
name: generate-util
description: Generate a small TypeScript utility module with a colocated test.
argument-hint: Utility name and target path
agent: agent
---

Generate a utility from the request that follows this prompt. If the name or target path is missing, ask for it before writing files.

1. Create a focused TypeScript module under the requested path.
2. Add a colocated test that covers the public behavior.
3. Stop once the files compile and the tests pass.
