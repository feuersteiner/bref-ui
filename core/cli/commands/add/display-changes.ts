import type { PreviewChange } from '../../installation/types.js';

/**
 * Print every preview status and its path relative to the configured UI directory.
 * @param changes Ordered additions, identical files and conflicts to display.
 * @throws When writing the terminal output fails.
 */
export const displayChanges = (changes: PreviewChange[]): void => {
	console.log('Planned UI changes:');
	console.log(changes.map(({ status, path }) => `  ${status}: ${path}`).join('\n'));
};
