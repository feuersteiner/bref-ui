export const scenes = [
	{ id: 'intro', label: 'Human first. Svelte first. Agent first.', duration: 8, chapter: 0 },
	{ id: 'demos', label: 'See what you can build.', duration: 2, chapter: 0 },
	{ id: 'todo', label: 'Todo', duration: 4, chapter: 0 },
	{ id: 'shop', label: 'House Shop', duration: 4, chapter: 0 },
	{ id: 'runner', label: 'RunnerAI', duration: 4, chapter: 0 },
	{ id: 'import-title', label: 'Import and use the components', duration: 3, chapter: 1 },
	{ id: 'install', label: 'One install. All the possibilities.', duration: 4, chapter: 1 },
	{ id: 'compose', label: 'Import. Compose. Ship.', duration: 14, chapter: 1 },
	{ id: 'customize', label: 'Your palette. Your personality.', duration: 7, chapter: 1 },
	{ id: 'modes', label: 'From day to night.', duration: 7, chapter: 1 },
	{ id: 'own-title', label: 'Own the code', duration: 3, chapter: 2 },
	{ id: 'cli', label: 'A component library. In your source tree.', duration: 8, chapter: 2 },
	{ id: 'files', label: 'Real files. Yours to change.', duration: 9, chapter: 2 },
	{ id: 'own-compose', label: 'Same components. Now local.', duration: 12, chapter: 2 },
	{ id: 'themes-title', label: 'Start with a theme. Make it yours.', duration: 3, chapter: 3 },
	{ id: 'paris', label: 'New Paris', duration: 12, chapter: 3 },
	{ id: 'vscode', label: 'VS Code', duration: 12, chapter: 3 },
	{ id: 'glassy', label: 'Glassy', duration: 12, chapter: 3 },
	{ id: 'end', label: 'Build cool shit ;)', duration: 10, chapter: 4 }
] as const;

export type Scene = (typeof scenes)[number];
export const duration = scenes.reduce((sum, scene) => sum + scene.duration, 0);
export const starts = scenes.map((_, index) =>
	scenes.slice(0, index).reduce((sum, scene) => sum + scene.duration, 0)
);
export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
export const ease = (value: number) => 1 - (1 - clamp(value)) ** 3;
export const locate = (seconds: number) => {
	const index = Math.max(
		starts.findLastIndex((start) => start <= seconds),
		0
	);
	return { scene: scenes[index], time: clamp(seconds - starts[index], 0, scenes[index].duration) };
};
export const formatTime = (seconds: number) =>
	`${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
export const typeWords = (source: string, progress: number) => {
	const words = source.match(/\S+\s*/g) ?? [];
	return words.slice(0, Math.floor(clamp(progress) * words.length)).join('');
};
