/** Component source ready for preview and copying into the consumer project. */
export interface PreparedFile {
	/** Destination path relative to the configured UI directory. */
	path: string;
	/** Source content with local type imports rewritten to the package type entry point. */
	content: string;
}
