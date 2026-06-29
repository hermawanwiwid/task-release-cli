import type { Command } from "commander";
import type { Task } from "../types/task.js";
import { JsonStore } from "../storage/jsonStore.js";

/** Compute the next sequential id for a list of tasks. */
function nextId(tasks: Task[]): number {
  return tasks.reduce((max, task) => Math.max(max, task.id), 0) + 1;
}

/**
 * Core add logic: create a new pending task and append it to the list.
 *
 * Kept pure (no I/O) so it can be unit tested directly.
 */
export function addTask(tasks: Task[], title: string, now: Date = new Date()): Task {
  const trimmed = title.trim();
  if (trimmed === "") {
    throw new Error("Task title must not be empty.");
  }

  return {
    id: nextId(tasks),
    title: trimmed,
    status: "pending",
    createdAt: now.toISOString(),
  };
}

/** Register the `add` command on the CLI program. */
export function registerAddCommand(program: Command, store: JsonStore): void {
  program
    .command("add")
    .description("Add a new task")
    .argument("<title>", "Title of the task")
    .action((title: string) => {
      const tasks = store.load();
      const task = addTask(tasks, title);
      tasks.push(task);
      store.save(tasks);
      console.log(`Task added: ${task.title}`);
    });
}
