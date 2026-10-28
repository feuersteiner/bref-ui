/** A canonical source path paired with its consumer-relative destination path. */
export interface SourceFile {
	/** Source path in the current workspace. */
	source: string;
	/** Destination path relative to the configured UI directory. */
	path: string;
}
