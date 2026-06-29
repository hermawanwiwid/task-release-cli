import type { Command } from "commander";
import type { Task } from "../types/task.js";
import { JsonStore } from "../storage/jsonStore.js";

/**
 * Core delete logic: return a new list with the task of the given id removed.
 *
 * Throws if no task has that id. Kept pure (no I/O) so it can be unit tested
 * directly.
 */
export function removeTask(tasks: Task[], id: number): Task[] {
  const exists = tasks.some((t) => t.id === id);
  if (!exists) {
    throw new Error(`No task found with id ${id}.`);
  }

  return tasks.filter((t) => t.id !== id);
}

/** Register the `delete` command on the CLI program. */
export function registerDeleteCommand(program: Command, store: JsonStore): void {
  program
    .command("delete")
    .description("Delete a task")
    .argument("<id>", "Id of the task to delete")
    .action((idArg: string) => {
      const id = Number.parseInt(idArg, 10);
      if (Number.isNaN(id)) {
        console.error(`Invalid id: ${idArg}`);
        process.exitCode = 1;
        return;
      }

      const tasks = store.load();
      try {
        const remaining = removeTask(tasks, id);
        store.save(remaining);
        console.log(`Task deleted: #${id}`);
      } catch (error) {
        console.error((error as Error).message);
        process.exitCode = 1;
      }
    });
}
