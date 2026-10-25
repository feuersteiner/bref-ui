/**
 * Read a confirmation using Bun's native terminal prompt, defaulting to refusal.
 * @param message Question to display before the yes/no hint.
 * @returns true only for y or yes, ignoring case and surrounding whitespace;
 * empty input, other answers and closed input return false.
 * @throws When Bun cannot read terminal input.
 */
export const confirm = (message: string): boolean => {
	const answer = prompt(`${message} [y/N] `);
	return answer !== null && /^(y|yes)$/i.test(answer.trim());
};
