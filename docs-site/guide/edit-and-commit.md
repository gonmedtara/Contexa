# Edit & git commit

## Edit mode

1. Open a file in the UI
2. Click **Edit**
3. Click a tag (MUST, SHOULD, `<examples>`, …) to insert a snippet
4. Adapt the text
5. Review the **Diff preview**
6. Click **Save**

## Commit option

Check **Also create a git commit** before saving.

### Requirements (yes, commit works when these are met)

| Requirement | Why |
|-------------|-----|
| Scanned folder contains `.git` | Commit needs a repository |
| `git config user.name` set | Git refuses anonymous commits |
| `git config user.email` set | Same |
| Content actually changed vs HEAD | Otherwise “nothing to commit” |

### Behavior

| Situation | Result |
|-----------|--------|
| Save without commit checkbox | Write file; `git add` if repo exists |
| Save with commit, valid git identity | Write → stage → commit |
| Save with commit, not a git repo | Error after write explaining commit is impossible |
| Save with commit, missing identity | Error after stage explaining config is required |

Configure identity (once per machine or repo):

```bash
git config user.name "Your Name"
git config user.email "you@example.com"
```
