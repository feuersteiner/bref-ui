import { execute } from './execute.js';
import { parse } from './parse.js';

/**
 * Parse executable arguments, run the requested command and report failures.
 * @param args Terminal arguments after the executable filename.
 * @param projectRoot Consumer project directory supplied by the executable's cwd.
 * @returns After help, command completion or cancellation; these exit successfully.
 * Invalid arguments and command failures are reported to stderr and set exit code 1.
 */
export const runCommand = async (args: string[], projectRoot: string): Promise<void> => {
	try {
		const command = parse(args);
		await execute(command, projectRoot);
	} catch (error) {
		console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
		process.exitCode = 1;
	}
};
