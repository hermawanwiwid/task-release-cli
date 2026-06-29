import type { Command } from "commander";
import type { Task } from "../types/task.js";
import { JsonStore } from "../storage/jsonStore.js";

/**
 * Core list formatting logic.
 *
 * Returns one line per task in the form: `1. [pending] Title`.
 * Kept pure (no I/O) so it can be unit tested directly.
 */
export function formatTasks(tasks: Task[]): string {
  if (tasks.length === 0) {
    return "No tasks yet. Add one with: tasker add \"My task\"";
  }

  return tasks
    .map((task) => `${task.id}. [${task.status}] ${task.title}`)
    .join("\n");
}

/** Register the `list` command on the CLI program. */
export function registerListCommand(program: Command, store: JsonStore): void {
  program
    .command("list")
    .description("List all tasks")
    .action(() => {
      const tasks = store.load();
      console.log(formatTasks(tasks));
    });
}
