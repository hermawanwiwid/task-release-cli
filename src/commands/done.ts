import type { Command } from "commander";
import type { Task } from "../types/task.js";
import { JsonStore } from "../storage/jsonStore.js";

/**
 * Core "mark done" logic: set a task's status to "done" by id.
 *
 * Mutates and returns the matching task. Throws if no task has that id.
 * Kept pure (no I/O) so it can be unit tested directly.
 */
export function markDone(tasks: Task[], id: number): Task {
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    throw new Error(`No task found with id ${id}.`);
  }

  task.status = "done";
  return task;
}

/** Register the `done` command on the CLI program. */
export function registerDoneCommand(program: Command, store: JsonStore): void {
  program
    .command("done")
    .description("Mark a task as done")
    .argument("<id>", "Id of the task to complete")
    .action((idArg: string) => {
      const id = Number.parseInt(idArg, 10);
      if (Number.isNaN(id)) {
        console.error(`Invalid id: ${idArg}`);
        process.exitCode = 1;
        return;
      }

      const tasks = store.load();
      try {
        const task = markDone(tasks, id);
        store.save(tasks);
        console.log(`Task done: ${task.title}`);
      } catch (error) {
        console.error((error as Error).message);
        process.exitCode = 1;
      }
    });
}
