import { describe, it, expect } from "vitest";
import { markDone } from "../src/commands/done.js";
import type { Task } from "../src/types/task.js";

function sampleTasks(): Task[] {
  return [
    { id: 1, title: "Prepare release branch", status: "pending", createdAt: "2026-06-29T00:00:00.000Z" },
    { id: 2, title: "Write changelog", status: "pending", createdAt: "2026-06-29T00:00:00.000Z" },
  ];
}

describe("markDone", () => {
  it("sets the matching task's status to done", () => {
    const tasks = sampleTasks();
    const task = markDone(tasks, 2);

    expect(task.status).toBe("done");
    expect(tasks[1].status).toBe("done");
  });

  it("leaves other tasks untouched", () => {
    const tasks = sampleTasks();
    markDone(tasks, 2);
    expect(tasks[0].status).toBe("pending");
  });

  it("throws when no task has the given id", () => {
    expect(() => markDone(sampleTasks(), 99)).toThrow(/No task found with id 99/);
  });
});
