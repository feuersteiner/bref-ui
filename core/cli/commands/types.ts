import type { DocumentationSection } from '../documentation/types.js';

/** Validated executable request, before accessing the consumer project. */
export type Command =
	| { name: 'help' }
	| { name: 'init' }
	| { name: 'add'; componentId: string }
	| { name: 'docs'; target: string; section?: DocumentationSection };
