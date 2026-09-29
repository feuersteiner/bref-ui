/** One name already exported by the consumer's index.ts. */
export interface ExistingExport {
	/** Public name used by consumers, such as Button. */
	name: string;
	/**
	 * Module path for a direct value re-export of default, such as ./button/button.svelte.
	 * Null means the name is occupied by another export and cannot be reused.
	 */
	componentPath: string | null;
}
