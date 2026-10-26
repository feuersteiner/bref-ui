import { afterAll, afterEach, beforeAll, expect } from 'vitest';
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const core = fileURLToPath(new URL('../', import.meta.url));
const fixtures = [];
let consumer;

const execute = (command, args, cwd, input = '', status = 0) => {
	const result = spawnSync(command, args, {
		cwd,
		input,
		encoding: 'utf8',
		timeout: command === 'npm' ? 120_000 : 20_000,
		env: { ...process.env, NO_COLOR: '1', ...(command === 'npx' && { npm_config_offline: 'true' }) }
	});
	const diagnostic = `${command} ${args.join(' ')}\n${result.stdout}\n${result.stderr}`;
	expect(result.error, diagnostic).toBeUndefined();
	expect(result.signal, diagnostic).toBeNull();
	expect(result.status, diagnostic).toBe(status);
	return `${result.stdout}${result.stderr}`;
};

beforeAll(async () => {
	consumer = await mkdtemp(join(tmpdir(), 'bref-cli-'));
	const require = createRequire(import.meta.url);
	const { version } = JSON.parse(await readFile(require.resolve('svelte/package.json'), 'utf8'));
	await writeFile(join(consumer, 'package.json'), '{"private":true}');
	execute('npm', ['pack', '--pack-destination', consumer], core);
	const archive = (await readdir(consumer)).find((file) => file.endsWith('.tgz'));
	execute(
		'npm',
		[
			'install',
			'--ignore-scripts',
			'--no-audit',
			'--no-fund',
			join(consumer, archive),
			`svelte@${version}`
		],
		consumer
	);
});

afterEach(async () => {
	await Promise.all(
		fixtures.splice(0).map((directory) => rm(directory, { recursive: true, force: true }))
	);
});

afterAll(async () => {
	if (consumer) await rm(consumer, { recursive: true, force: true });
});

export const fixture = async (manifest = {}) => {
	const directory = await mkdtemp(join(consumer, 'project-'));
	fixtures.push(directory);
	await writeFile(
		join(directory, 'package.json'),
		`${JSON.stringify({ name: 'cli-consumer', private: true, ...manifest }, null, 2)}\n`
	);
	return directory;
};

export const cli = (directory, args, input = '', status = 0) =>
	execute('npx', ['--no', '--', 'bref-ui', ...args], directory, input, status);

export const snapshot = async (directory) => {
	const files = await readdir(directory, { recursive: true, withFileTypes: true });
	return Object.fromEntries(
		await Promise.all(
			files
				.filter((file) => file.isFile())
				.map(async (file) => {
					const path = join(file.parentPath, file.name);
					return [path.slice(directory.length + 1), await readFile(path, 'utf8')];
				})
		)
	);
};
