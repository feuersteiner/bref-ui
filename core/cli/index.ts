#!/usr/bin/env bun
import { runCommand } from './commands/index.js';

if (import.meta.main) await runCommand(Bun.argv.slice(2), process.cwd());
