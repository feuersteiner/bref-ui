/** Component installation metadata declared in a colocated registry.json. */
export interface RegistryItem {
	/** Unique kebab-case component identifier. */
	id: string;
	/** Unique source-file paths relative to the component directory. */
	files: string[];
	/** Component export names mapped to paths listed in files. */
	exports: Record<string, string>;
	/** Unique component IDs required by this component; may be empty. */
	dependencies: string[];
}

/** Validated manifest metadata paired with its source directory. */
export interface RegistryEntry extends RegistryItem {
	/** Containing component directory, used to locate the listed source files. */
	directory: string;
}
