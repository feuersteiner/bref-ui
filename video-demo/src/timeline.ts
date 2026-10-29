// Screen durations map onto deterministic animation clocks for frame-accurate export.
export const scenes = [
	{ id: 'intro', label: 'Bref-ui', duration: 2.75, sourceDuration: 5, chapter: 0 },
	{ id: 'demos', label: 'New demos', duration: 1.5, sourceDuration: 1.5, chapter: 0 },
	{ id: 'apps', label: 'Three live demos', duration: 9, sourceDuration: 14, chapter: 0 },
	{
		id: 'import-title',
		label: 'Import the components',
		duration: 1,
		sourceDuration: 2.5,
		chapter: 1
	},
	{ id: 'install', label: 'npm install bref-ui', duration: 1.5, sourceDuration: 3, chapter: 1 },
	{ id: 'compose', label: 'Compose a mini form', duration: 5.5, sourceDuration: 18, chapter: 1 },
	{ id: 'customize', label: 'Customize your theme', duration: 4, sourceDuration: 12, chapter: 1 },
	{ id: 'own-title', label: 'Own the code', duration: 1, sourceDuration: 2.5, chapter: 2 },
	{ id: 'cli', label: 'Copy the source', duration: 2.5, sourceDuration: 9, chapter: 2 },
	{
		id: 'files',
		label: 'From npm to your codebase',
		duration: 3.5,
		sourceDuration: 3.5,
		chapter: 2
	},
	{ id: 'paris', label: 'New Paris', duration: 6.5, sourceDuration: 22, chapter: 3 },
	{ id: 'vscode', label: 'ADE · VS Code', duration: 6, sourceDuration: 18, chapter: 3 },
	{ id: 'glassy', label: 'Glassy', duration: 6, sourceDuration: 18, chapter: 3 },
	{
		id: 'theme-install',
		label: 'Import the themes',
		duration: 2.25,
		sourceDuration: 7,
		chapter: 3
	},
	{ id: 'end', label: 'Your turn', duration: 7, sourceDuration: 7, chapter: 4 }
] as const;
export type Scene = (typeof scenes)[number];
export const duration = scenes.reduce((sum, scene) => sum + scene.duration, 0);
export const starts = scenes.map((_, index) =>
	scenes.slice(0, index).reduce((sum, scene) => sum + scene.duration, 0)
);
export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
export const ease = (value: number) => 1 - (1 - clamp(value)) ** 3;
// Quintic easing has zero velocity and acceleration at both ends.
export const smooth = (value: number) => {
	const p = clamp(value);
	return p * p * p * (p * (p * 6 - 15) + 10);
};
export const locate = (seconds: number) => {
	const index = Math.max(
		starts.findLastIndex((start) => start <= seconds),
		0
	);
	const scene = scenes[index];
	return {
		scene,
		time:
			(clamp(seconds - starts[index], 0, scene.duration) * scene.sourceDuration) / scene.duration
	};
};
export const formatTime = (seconds: number) =>
	`${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
export const typeChars = (source: string, progress: number) =>
	Array.from(source)
		.slice(0, Math.floor(clamp(progress) * Array.from(source).length))
		.join('');
