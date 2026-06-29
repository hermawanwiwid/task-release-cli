# task-release-cli

A simple command-line task manager for tracking release-related tasks, feature
tasks, and bugfix tasks during software development.

The CLI binary is called **`tasker`**.

> This project is also a hands-on playground for practising a professional Git
> release and versioning workflow (Semantic Versioning, Conventional Commits,
> CHANGELOG, Git tags, and GitHub/GitLab Releases). See
> [docs/release-workflow.md](docs/release-workflow.md).

## Features (v0.1.0)

- `tasker add "title"` — add a new task
- `tasker list` — list all tasks
- `tasker --version` — print the CLI version

> `done` and `delete` commands are intentionally **not** implemented yet — they
> are planned for later feature releases so the release workflow can be
> practised end to end.

## Installation

```bash
# Clone and install dependencies
git clone https://github.com/your-username/task-release-cli.git
cd task-release-cli
npm install

# Build the CLI
npm run build

# Link it globally so `tasker` is on your PATH (optional)
npm link
```

During development you can run the CLI without building using `npm run dev`:

```bash
npm run dev -- add "Prepare release branch"
npm run dev -- list
```

## Usage

```bash
tasker add "Prepare release branch"
# Task added: Prepare release branch

tasker list
# 1. [pending] Prepare release branch

tasker --version
# 0.1.0
```

### Where are tasks stored?

Tasks are stored as JSON. By default the file lives at:

```
~/.task-release-cli/tasks.json
```

You can override the location with the `TASKER_DATA_FILE` environment variable,
which is handy for keeping a project-local task list:

```bash
TASKER_DATA_FILE=./tasks.json tasker add "Project-local task"
```

The data format:

```json
[
  {
    "id": 1,
    "title": "Prepare release branch",
    "status": "pending",
    "createdAt": "2026-06-29T00:00:00.000Z"
  }
]
```

## Development

```bash
npm run dev          # run the CLI from source (tsx)
npm run build        # compile TypeScript to dist/
npm run typecheck    # type-check without emitting
npm test             # run the Vitest test suite
npm run test:watch   # run tests in watch mode
npm run lint         # run ESLint
```

## Project structure

```
src/
  index.ts            # CLI entry point (Commander)
  commands/           # one file per command (pure logic + registration)
  storage/            # JSON file persistence
  types/              # shared TypeScript types
tests/                # Vitest unit tests
docs/                 # release workflow guide
.github/workflows/    # CI
```

## Release strategy summary

This project follows **Semantic Versioning** (`MAJOR.MINOR.PATCH`) and
**Conventional Commits**, with releases prepared on dedicated `release/*`
branches and shipped via Git tags + GitHub/GitLab Releases.

The branch model:

| Branch          | Purpose                                  |
| --------------- | ---------------------------------------- |
| `main`          | Production / stable, every commit tagged |
| `develop`       | Integration branch for ongoing work      |
| `feature/*`     | New features (branched from `develop`)   |
| `release/vX.Y.Z`| Release preparation (version + CHANGELOG)|
| `hotfix/vX.Y.Z` | Urgent production fixes (from `main`)    |

Full step-by-step guide: [docs/release-workflow.md](docs/release-workflow.md).

### Versioning examples

| Change                                   | Commit type           | Version bump      |
| ---------------------------------------- | --------------------- | ----------------- |
| Add `tasker done` command                | `feat:`               | `0.1.0` → `0.2.0` |
| Fix crash when task file is empty        | `fix:`                | `0.2.0` → `0.2.1` |
| Rename a command / break the CLI API     | `feat!:` / `BREAKING` | `0.2.1` → `1.0.0` |
| Update docs only                         | `docs:`               | no release        |

## License

MIT
