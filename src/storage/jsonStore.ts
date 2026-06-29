import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { homedir } from "node:os";
import type { Task } from "../types/task.js";

/**
 * Resolve the path to the JSON file used for task storage.
 *
 * The location can be overridden with the TASKER_DATA_FILE environment
 * variable, which is primarily useful for tests and for pointing the CLI
 * at a project-local task file.
 */
export function getDefaultStorePath(): string {
  return (
    process.env.TASKER_DATA_FILE ??
    join(homedir(), ".task-release-cli", "tasks.json")
  );
}

/**
 * Small JSON-file backed store for tasks.
 *
 * Storage logic is intentionally isolated from CLI command logic so that it
 * can be tested in isolation and swapped out later (e.g. for a database).
 */
export class JsonStore {
  private readonly filePath: string;

  constructor(filePath: string = getDefaultStorePath()) {
    this.filePath = filePath;
  }

  /** Read all tasks from disk. Returns an empty list if no file exists yet. */
  load(): Task[] {
    if (!existsSync(this.filePath)) {
      return [];
    }

    const raw = readFileSync(this.filePath, "utf-8").trim();
    if (raw === "") {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      throw new Error(`Corrupt task file: ${this.filePath}`);
    }

    return parsed as Task[];
  }

  /** Persist the full task list to disk, creating the directory if needed. */
  save(tasks: Task[]): void {
    mkdirSync(dirname(this.filePath), { recursive: true });
    writeFileSync(this.filePath, JSON.stringify(tasks, null, 2) + "\n", "utf-8");
  }
}
