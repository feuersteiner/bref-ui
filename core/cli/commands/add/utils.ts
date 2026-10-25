import { readSync } from 'node:fs';

/**
 * Read one terminal input line, defaulting to refusal.
 * @param message Question to display before the yes/no hint.
 * @returns true only for y or yes, ignoring case and surrounding whitespace;
 * empty input, other answers and closed input return false.
 * @throws When terminal input cannot be read.
 */
export const confirm = (message: string): boolean => {
	process.stdout.write(`${message} [y/N] `);
	const byte = Buffer.alloc(1);
	let answer = '';
	while (readSync(0, byte, 0, 1, null) > 0) {
		if (byte[0] === 10) return /^(y|yes)$/i.test(answer.trim());
		answer += byte.toString();
	}
	return false;
};
