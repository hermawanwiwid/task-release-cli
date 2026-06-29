# Release Workflow — Hands-on Guide

This document is a practical, step-by-step guide for practising a professional
Git release and versioning workflow with **task-release-cli**. It works the same
way on GitHub (Pull Requests) and GitLab (Merge Requests) — the only difference
is the name of the review request.

The goal: learn how real teams ship software using a branching model, Semantic
Versioning, Conventional Commits, a CHANGELOG, Git tags, and platform Releases.

---

## 1. Concepts

### Branch model (Gitflow-style)

| Branch           | Branched from | Merged into        | Purpose                              |
| ---------------- | ------------- | ------------------ | ------------------------------------ |
| `main`           | —             | —                  | Production / stable. Every release is a tagged commit here. |
| `develop`        | `main`        | (via release)      | Integration branch for ongoing work. |
| `feature/*`      | `develop`     | `develop`          | A single new feature or change.      |
| `release/vX.Y.Z` | `develop`     | `main` + `develop` | Prepare a release (version, CHANGELOG). |
| `hotfix/vX.Y.Z`  | `main`        | `main` + `develop` | Urgent fix for production.           |

### Semantic Versioning (`MAJOR.MINOR.PATCH`)

- **MAJOR** — incompatible / breaking changes (`1.x.x` → `2.0.0`).
- **MINOR** — new functionality, backwards compatible (`0.1.0` → `0.2.0`).
- **PATCH** — backwards-compatible bug fixes (`0.2.0` → `0.2.1`).

While the project is pre-1.0 (`0.y.z`), the API is considered unstable, so new
features and breaking changes typically bump the **MINOR** number.

### Conventional Commits

Format: `type(optional scope): description`

Common types:

| Type        | Use for                          | Typical bump |
| ----------- | -------------------------------- | ------------ |
| `feat`      | A new feature                    | MINOR        |
| `fix`       | A bug fix                        | PATCH        |
| `docs`      | Documentation only               | none         |
| `test`      | Adding or fixing tests           | none         |
| `refactor`  | Code change, no behaviour change | none         |
| `chore`     | Tooling, deps, housekeeping      | none         |
| `ci`        | CI configuration                 | none         |

A breaking change is marked with a `!` after the type or a `BREAKING CHANGE:`
footer, e.g. `feat!: rename done command to complete`.

Examples:

```text
feat(commands): add `done` command to mark tasks complete
fix(storage): handle empty task file without throwing
docs(readme): document TASKER_DATA_FILE override
chore(release): bump version to 0.2.0
```

---

## 2. One-time setup

```bash
# Start from main and create the long-lived develop branch.
git checkout main
git pull origin main
git checkout -b develop
git push -u origin develop
```

From now on, day-to-day work happens on `feature/*` branches off `develop`.

---

## 3. Full learning path (feature release)

This walks through shipping a new feature, e.g. the future `tasker done` command.

### Step 1 — Create `develop` from `main`

(Done once in the setup above; reuse it afterwards.)

### Step 2 — Create a feature branch from `develop`

```bash
git checkout develop
git pull origin develop
git checkout -b feature/done-command
```

### Step 3 — Commit using Conventional Commits

```bash
# ...implement the feature and its tests...
git add .
git commit -m "feat(commands): add done command to mark a task complete"
git commit -m "test(commands): cover done command edge cases"
```

### Step 4 — Open a Pull Request / Merge Request into `develop`

```bash
git push -u origin feature/done-command
```

Then open a PR (GitHub) / MR (GitLab) targeting **`develop`**. CI runs
automatically (`npm ci`, typecheck, test, build).

### Step 5 — Merge after CI passes

Get a review, ensure CI is green, then merge the PR/MR into `develop`.
Delete the feature branch afterwards.

### Step 6 — Create a release branch from `develop`

When `develop` has enough changes to ship:

```bash
git checkout develop
git pull origin develop
git checkout -b release/v0.2.0
```

### Step 7 — Update the version and CHANGELOG

Bump the version in `package.json` (this also creates a commit if you use `npm
version`, but on a release branch many teams prefer to do it manually):

```bash
npm version 0.2.0 --no-git-tag-version
```

Update `CHANGELOG.md`: move items out of `[Unreleased]` into a new
`## [0.2.0] - YYYY-MM-DD` section (Keep a Changelog format), then commit:

```bash
git add package.json package-lock.json CHANGELOG.md
git commit -m "chore(release): prepare v0.2.0"
git push -u origin release/v0.2.0
```

### Step 8 — Open a PR/MR from the release branch into `main`

Target **`main`**. This is the final review before production. Only release
preparation commits (version bump, CHANGELOG, last-minute fixes) belong here.

### Step 9 — Merge into `main`

Once approved and CI is green, merge the release PR/MR into `main`.

```bash
git checkout main
git pull origin main
```

### Step 10 — Create a Git tag

Tag the merged release commit on `main`:

```bash
git tag -a v0.2.0 -m "Release v0.2.0"
```

> Tags use a leading `v` (e.g. `v0.2.0`) by convention.

### Step 11 — Push the tag

```bash
git push origin v0.2.0
```

### Step 12 — Create a GitHub / GitLab Release

- **GitHub:** `gh release create v0.2.0 --title "v0.2.0" --notes-file <(...)`,
  or via the web UI → Releases → Draft a new release → choose tag `v0.2.0`.
- **GitLab:** Deploy → Releases → New release → choose tag `v0.2.0`.

Paste the relevant `CHANGELOG.md` section as the release notes.

```bash
# GitHub CLI example (notes pulled from the changelog section):
gh release create v0.2.0 --title "v0.2.0" --notes "See CHANGELOG.md for details."
```

### Step 13 — Merge `main` back into `develop`

Production now has commits (version bump, CHANGELOG) that `develop` lacks. Sync
them back so the branches don't diverge:

```bash
git checkout develop
git pull origin develop
git merge main
git push origin develop
```

### Step 14 — Hotfixes (urgent production bugs)

When a bug must be fixed in production immediately, branch from **`main`**, not
`develop`:

```bash
git checkout main
git pull origin main
git checkout -b hotfix/v0.2.1

# fix the bug
git commit -m "fix(storage): prevent crash on corrupt task file"

# bump PATCH version + changelog
npm version 0.2.1 --no-git-tag-version
git commit -am "chore(release): prepare v0.2.1"
git push -u origin hotfix/v0.2.1
```

Then:

1. Open a PR/MR from `hotfix/v0.2.1` into `main`.
2. Merge after CI passes.
3. Tag `v0.2.1` on `main` and push the tag.
4. Create the GitHub/GitLab Release.
5. Merge `main` back into `develop` (Step 13) so the fix is not lost.

---

## 4. Quick reference

```text
feature work:   develop ──> feature/* ──(PR)──> develop
release:        develop ──> release/vX.Y.Z ──(PR)──> main ──> tag ──> Release ──> back-merge to develop
hotfix:         main    ──> hotfix/vX.Y.Z  ──(PR)──> main ──> tag ──> Release ──> back-merge to develop
```

### Version bump cheat-sheet

| You did...                    | Bump  | Example         |
| ----------------------------- | ----- | --------------- |
| Added a feature               | MINOR | 0.1.0 → 0.2.0   |
| Fixed a bug                   | PATCH | 0.2.0 → 0.2.1   |
| Made a breaking change        | MAJOR | 0.2.1 → 1.0.0   |

---

## 5. Practising with this repo

A suggested exercise sequence as you build out the CLI:

1. **v0.1.0** — initial release (already done): `add`, `list`, `--version`.
2. **v0.2.0** — `feat`: implement `tasker done <id>` via the full feature → release flow.
3. **v0.3.0** — `feat`: implement `tasker delete <id>`.
4. **v0.3.1** — `fix`: practise a hotfix on a small bug.
5. **v1.0.0** — declare the CLI stable (a `feat!`/breaking milestone).

Each step is a chance to repeat Steps 2–13 until the workflow is second nature.
