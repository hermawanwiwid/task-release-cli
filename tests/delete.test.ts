import { describe, it, expect } from "vitest";
import { removeTask } from "../src/commands/delete.js";
import type { Task } from "../src/types/task.js";

function sampleTasks(): Task[] {
  return [
    { id: 1, title: "Prepare release branch", status: "pending", createdAt: "2026-06-29T00:00:00.000Z" },
    { id: 2, title: "Write changelog", status: "done", createdAt: "2026-06-29T00:00:00.000Z" },
  ];
}

describe("removeTask", () => {
  it("removes the task with the given id", () => {
    const remaining = removeTask(sampleTasks(), 1);
    expect(remaining).toHaveLength(1);
    expect(remaining[0].id).toBe(2);
  });

  it("does not mutate the original list", () => {
    const tasks = sampleTasks();
    removeTask(tasks, 1);
    expect(tasks).toHaveLength(2);
  });

  it("throws when no task has the given id", () => {
    expect(() => removeTask(sampleTasks(), 99)).toThrow(/No task found with id 99/);
  });
});
