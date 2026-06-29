import { describe, it, expect } from "vitest";
import { addTask } from "../src/commands/add.js";
import type { Task } from "../src/types/task.js";

describe("addTask", () => {
  it("creates a pending task with id 1 when the list is empty", () => {
    const task = addTask([], "Prepare release branch", new Date("2026-06-29T00:00:00.000Z"));

    expect(task).toEqual<Task>({
      id: 1,
      title: "Prepare release branch",
      status: "pending",
      createdAt: "2026-06-29T00:00:00.000Z",
    });
  });

  it("assigns the next sequential id based on the highest existing id", () => {
    const existing: Task[] = [
      { id: 1, title: "First", status: "done", createdAt: "2026-06-29T00:00:00.000Z" },
      { id: 5, title: "Second", status: "pending", createdAt: "2026-06-29T00:00:00.000Z" },
    ];

    const task = addTask(existing, "Third");
    expect(task.id).toBe(6);
  });

  it("trims surrounding whitespace from the title", () => {
    const task = addTask([], "   Write changelog   ");
    expect(task.title).toBe("Write changelog");
  });

  it("throws when the title is empty or whitespace only", () => {
    expect(() => addTask([], "   ")).toThrow(/must not be empty/);
  });
});
