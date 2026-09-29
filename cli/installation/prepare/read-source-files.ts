import type { PreparedFile } from '../types.js';
import type { SourceFile } from './types.js';
import { rewriteSource } from './rewrite-source.js';

/**
 * Read and prepare source files concurrently while retaining input order.
 * @param files Source paths and their destination-relative paths.
 * @returns Prepared files in the supplied order.
 * @throws When a source cannot be read or its contents cannot be prepared.
 */
export const readSourceFiles = async (files: SourceFile[]): Promise<PreparedFile[]> =>
	Promise.all(
		files.map(async ({ source, path }) => ({
			path,
			content: rewriteSource(await Bun.file(source).text(), source)
		}))
	);
