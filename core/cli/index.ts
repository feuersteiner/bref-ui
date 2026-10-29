#!/usr/bin/env node
import { runCommand } from './commands/index.js';

await runCommand(process.argv.slice(2), process.cwd());
