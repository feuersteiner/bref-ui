export interface RegistryItem {
	id: string;
	files: string[];
	exports: Record<string, string>;
	dependencies: string[];
}

export interface RegistryEntry extends RegistryItem {
	directory: string;
}
