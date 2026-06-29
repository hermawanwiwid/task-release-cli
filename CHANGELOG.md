# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-06-29

First stable release. The CLI is now considered stable and follows Semantic
Versioning guarantees from this point on.

### Changed
- **BREAKING:** `tasker list` now prints tasks in checkbox format
  (`[ ] #1  Title` / `[x] #1  Title`) instead of the old
  `1. [pending] Title` format. Scripts that parse the previous output must be
  updated.

## [0.2.1] - 2026-06-29

### Fixed
- `tasker add ""` now prints a clean error message instead of crashing with a stack trace.

## [0.2.0] - 2026-06-29

### Added
- Mark task as done command (`tasker done <id>`).

## [0.1.0] - 2026-06-29

### Added
- Add task command (`tasker add "title"`).
- List task command (`tasker list`).
- CLI version command (`tasker --version`).
- Local JSON task storage.
- Initial test setup with Vitest.
- CI workflow with GitHub Actions.

[Unreleased]: https://github.com/your-username/task-release-cli/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/your-username/task-release-cli/compare/v0.2.1...v1.0.0
[0.2.1]: https://github.com/your-username/task-release-cli/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/your-username/task-release-cli/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/your-username/task-release-cli/releases/tag/v0.1.0
