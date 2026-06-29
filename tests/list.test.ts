import { describe, it, expect } from "vitest";
import { formatTasks } from "../src/commands/list.js";
import type { Task } from "../src/types/task.js";

describe("formatTasks", () => {
  it("renders a helpful message when there are no tasks", () => {
    expect(formatTasks([])).toMatch(/No tasks yet/);
  });

  it("formats each task as a checkbox line `[ ] #id  title`", () => {
    const tasks: Task[] = [
      { id: 1, title: "Prepare release branch", status: "pending", createdAt: "2026-06-29T00:00:00.000Z" },
      { id: 2, title: "Tag v0.1.0", status: "done", createdAt: "2026-06-29T00:00:00.000Z" },
    ];

    expect(formatTasks(tasks)).toBe(
      "[ ] #1  Prepare release branch\n[x] #2  Tag v0.1.0"
    );
  });
});
