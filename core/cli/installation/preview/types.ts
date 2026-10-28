/** Read result for one destination path. */
export interface DestinationFile {
	/** Destination path relative to the configured UI directory. */
	path: string;
	/** Whether the destination file exists. */
	exists: boolean;
	/** Existing file content, present when the file exists. */
	content?: string;
}
