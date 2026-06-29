import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { JsonStore } from "../src/storage/jsonStore.js";
import type { Task } from "../src/types/task.js";

describe("JsonStore", () => {
  let dir: string;
  let store: JsonStore;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "tasker-test-"));
    store = new JsonStore(join(dir, "tasks.json"));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("returns an empty list when no file exists yet", () => {
    expect(store.load()).toEqual([]);
  });

  it("persists tasks and reads them back", () => {
    const tasks: Task[] = [
      { id: 1, title: "Prepare release branch", status: "pending", createdAt: "2026-06-29T00:00:00.000Z" },
    ];

    store.save(tasks);
    expect(store.load()).toEqual(tasks);
  });

  it("creates the storage directory on save if it is missing", () => {
    const nested = new JsonStore(join(dir, "deep", "nested", "tasks.json"));
    nested.save([]);
    expect(nested.load()).toEqual([]);
  });
});
