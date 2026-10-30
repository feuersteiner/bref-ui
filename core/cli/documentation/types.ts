import type { ComponentDocProps } from '../../.svelte-kit/reference/types/docs.js';

/** Serializable documentation bundled at packaging time; never loaded by component imports. */
export interface DocumentationCatalogue {
	version: string;
	cli: string;
	components: Record<
		string,
		ComponentDocProps & {
			name: string;
			installation: string;
			copyable: boolean;
		}
	>;
}

/** Supported component reference sections; omission requests the full reference. */
export type DocumentationSection = 'usage' | 'props' | 'cli';
