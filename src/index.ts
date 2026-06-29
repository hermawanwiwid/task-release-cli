#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Command } from "commander";
import { JsonStore } from "./storage/jsonStore.js";
import { registerAddCommand } from "./commands/add.js";
import { registerListCommand } from "./commands/list.js";
import { registerDoneCommand } from "./commands/done.js";
import { registerDeleteCommand } from "./commands/delete.js";

/** Read the CLI version from package.json so --version stays in sync. */
function readVersion(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  // package.json sits one level above both src/ (dev) and dist/ (build).
  const pkgPath = join(here, "..", "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8")) as { version: string };
  return pkg.version;
}

export function buildProgram(store: JsonStore = new JsonStore()): Command {
  const program = new Command();

  program
    .name("tasker")
    .description("A simple CLI task manager for tracking release-related tasks")
    .version(readVersion(), "-v, --version", "Output the current version");

  registerAddCommand(program, store);
  registerListCommand(program, store);
  registerDoneCommand(program, store);
  registerDeleteCommand(program, store);

  return program;
}

buildProgram().parse(process.argv);
