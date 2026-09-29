/** Component source ready for preview and copying into the consumer project. */
export interface PreparedFile {
	/** Destination path relative to the configured UI directory. */
	path: string;
	/** Source content with local type imports rewritten to the package type entry point. */
	content: string;
}

/** Result of comparing one prepared source against its destination file. */
export interface PreviewChange {
	/** Destination path relative to the configured UI directory. */
	path: string;
	/** Whether the file is absent, identical or contains different content. */
	status: 'add' | 'unchanged' | 'conflict';
}
