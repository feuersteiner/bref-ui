/** Component source or index.ts ready for preview and copying into the consumer project. */
export interface PreparedFile {
	/** Destination path relative to the configured UI directory. */
	path: string;
	/** Prepared content, including rewritten source imports or merged component exports. */
	content: string;
}

/** Result of comparing one prepared source against its destination file. */
export interface PreviewChange {
	/** Destination path relative to the configured UI directory. */
	path: string;
	/** Whether the file is absent, identical or contains different content. */
	status: 'add' | 'unchanged' | 'conflict';
}
