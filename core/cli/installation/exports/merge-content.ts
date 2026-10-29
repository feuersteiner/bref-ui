/**
 * Append new statements while preserving existing text and its newline style.
 * @param content Original destination index.ts content.
 * @param additions Missing export statements to append.
 * @returns Unchanged content when no exports are missing, otherwise the merged text.
 */
export const mergeContent = (content: string, additions: string[]): string => {
	if (additions.length === 0) return content;
	const newline = content.includes('\r\n') ? '\r\n' : '\n';
	const separator = content.length > 0 && !content.endsWith('\n') ? newline : '';
	return content + separator + additions.join(newline) + newline;
};
