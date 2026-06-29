# Learning Log & Roadmap — task-release-cli

> **Purpose of this file:** a single place to see what has been built, *why* each
> decision was made, and what to do next — so work can be resumed in any future
> session (or by anyone reading the repo).
>
> This project is primarily a **hands-on sandbox for practising a professional
> Git release & versioning workflow**. The working CLI is the vehicle; the
> *workflow practice* is the real goal. For the step-by-step workflow how-to, see
> [release-workflow.md](release-workflow.md).

---

## 1. The project in one line

`task-release-cli` — a small TypeScript CLI (`tasker`) to track tasks
(`add` / `list` / `done` / `delete`), built with Commander + Vitest, used to
practise SemVer, Conventional Commits, CHANGELOG, tags, GitHub Releases, and
release automation.

---

## 2. Progress so far (what shipped, and what was practised)

| Version | What shipped | Workflow practised |
| ------- | ------------ | ------------------ |
| **v0.1.0** | `add`, `list`, `--version` + project scaffold, CI | Initial baseline on `main`, first tag + GitHub Release |
| **v0.2.0** | `done` command | `feat:` → MINOR; full Gitflow: feature → develop → release branch → main → tag → Release → back-merge |
| **v0.2.1** | Fix: `add ""` no longer crashes | `fix:` → PATCH; **hotfix** flow (branch from `main`, land fix in **both** `main` and `develop`) |
| **v1.0.0** | Breaking: `list` now uses checkbox format `[ ] #1 Title` | `feat!:` → MAJOR; first "stable" release |
| _(docs/ci)_ | README sync; adopted **release-please** automation | `docs:` (no release); migrated from manual releases to automated |
| **v1.1.0** | `delete` command | **First fully automated release** via release-please (hybrid model) |

Tags/releases live on GitHub: `v0.1.0`, `v0.2.0`, `v0.2.1`, `v1.0.0`, `v1.1.0`.

---

## 3. Key lessons learned (the *why*)

- **Tag vs branch vs Release.** A *branch* is a moving pointer to a commit; a
  *tag* is a frozen pointer; both live in git (synced by `git push`). A *GitHub
  Release* is GitHub-platform metadata wrapped around a tag — created via UI/`gh`,
  not git.
- **SemVer mapping.** `fix:` → PATCH, `feat:` → MINOR, `feat!:`/`BREAKING CHANGE:`
  → MAJOR. `docs:`/`ci:`/`chore:` → no release.
- **A hotfix lands in TWO branches** (`main` to fix prod now, `develop` so the fix
  isn't lost in the next release).
- **PR vs local merge.** A PR is `git merge` + review + CI gate + record. For
  teams/shared branches the gate matters; for solo trivial work a local merge is
  fine.
- **The branching model decides where features go.** In **Gitflow**, features →
  `develop`. In **trunk-based**, features → `main`. Neither is "the rule" — the
  rule follows the model you chose.
- **Release automation adoption gotcha.** When bolting release-please onto an
  existing repo, it must recognise your last release or it re-counts history.
  Here it expected `task-release-cli-v1.0.0` tags but ours were `v1.0.0` → it
  proposed a wrong `2.0.0`. Fix: `include-component-in-tag: false` in
  `release-please-config.json`.
- **release-please keeps ONE long-lived Release PR** and updates it in place —
  never close it; let it update, or merge it.

---

## 4. Current setup (as of this log)

- **Stack:** Node 18+, TypeScript (ESM/NodeNext), Commander, Vitest, ESLint.
- **Branching model: HYBRID**
  - `develop` = **staging** (integration)
  - `main` = **production** (release-please runs here)
- **Release automation:** release-please via `.github/workflows/release-please.yml`
  + `release-please-config.json` (`include-component-in-tag: false`) +
  `.release-please-manifest.json` (tracks current version).

### The current release cycle (cheat-sheet)

```
1. feature/* ── PR ──▶ develop          (build & integrate)
2. develop  ── PR ──▶ main              (promote to production)
3. 🤖 release-please opens/updates ONE Release PR on main
4. merge the Release PR ──▶ auto tag + GitHub Release
5. main ── merge ──▶ develop            (back-merge the version bump)  ← the one manual step
```

**Discipline rule:** never hand-edit `package.json` version or `CHANGELOG.md` —
those belong to release-please now. Feature branches carry *code* only.

---

## 5. Roadmap / future work (pick up here)

Rough priority order:

1. **commitlint + husky** — reject malformed commit messages locally *before*
   they're committed, so release automation never silently breaks on a bad
   message. (husky = runs checks at git hooks; commitlint = checks the message
   follows Conventional Commits.)
2. **Branch protection on `main`** — require **green CI** + **review approval**
   before merge, so `main` is trustworthy by construction.
3. **commitlint in CI too** — local hooks are bypassable (`--no-verify`); a CI
   check enforces the rule for everyone.
4. **Auto-publish to npm** — extend the release workflow to `npm publish` when a
   release is cut, so `npm i -g task-release-cli` works.
5. **A `feat!` under automation** — make another breaking change and confirm
   release-please now proposes **v2.0.0 correctly** (closing the loop on the
   earlier mis-count).
6. **Housekeeping** — delete stale remote branches when convenient:
   `git push origin --delete release/v0.2.0 release/v1.0.0`

---

## 6. How to resume in a new session

> "Read `docs/learning-log.md`. We're at **v1.1.0** on a release-please **hybrid**
> model (develop=staging, main=prod). Next up: **commitlint + husky**, then
> **branch protection**. I run the git/GitHub commands myself; explain the *why*
> and surface any model changes before acting."
