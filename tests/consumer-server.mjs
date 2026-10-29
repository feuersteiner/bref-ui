import { cp, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const directory = await mkdtemp(join(tmpdir(), 'bref-consumers-'));
let server;
let cleaning = false;
const cleanup = async (code) => {
	if (cleaning) return;
	cleaning = true;
	server?.kill('SIGTERM');
	await rm(directory, { recursive: true, force: true });
	process.exit(code);
};
process.on('SIGINT', () => void cleanup(0));
process.on('SIGTERM', () => void cleanup(0));

const run = (command, args, cwd = directory, input) => {
	const result = spawnSync(command, args, {
		cwd,
		input,
		encoding: 'utf8',
		timeout: 180_000,
		maxBuffer: 10 * 1024 * 1024
	});
	if (result.error || result.status !== 0)
		throw new Error(`${command} ${args.join(' ')}\n${result.stdout}\n${result.stderr}`, {
			cause: result.error
		});
	console.log(`${command} ${args.join(' ')}: passed`);
	return result.stdout;
};

try {
	run('bun', ['run', 'build:packages'], root);
	const archives = {};
	for (const workspace of ['core', 'themes']) {
		const output = run(
			'npm',
			['pack', '--ignore-scripts', '--json', '--pack-destination', directory],
			join(root, workspace)
		);
		const [packed] = JSON.parse(output);
		if (packed.files.some(({ path }) => /(?:^|\/)(?:tests|node_modules)\//.test(path)))
			throw new Error(`${workspace} tarball contains test or dependency files.`);
		archives[packed.name] = join(directory, packed.filename);
	}
	const tooling = {};
	for (const name of [
		'svelte',
		'@sveltejs/kit',
		'@sveltejs/adapter-static',
		'@sveltejs/vite-plugin-svelte',
		'vite',
		'typescript',
		'svelte-check'
	])
		tooling[name] = JSON.parse(
			await readFile(join(root, 'core/node_modules', name, 'package.json'), 'utf8')
		).version;
	await writeFile(
		join(directory, 'package.json'),
		JSON.stringify({ private: true, type: 'module', dependencies: { ...tooling, ...archives } })
	);
	run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund']);
	await cp(new URL('./consumer/', import.meta.url), directory, { recursive: true });
	const cli = join(directory, 'node_modules/bref-ui/dist-cli/index.js');
	run(process.execPath, [cli, 'init']);
	const registryRoot = join(directory, 'node_modules/bref-ui/src/lib');
	let count = 0;
	for (const folder of await readdir(registryRoot, { withFileTypes: true })) {
		if (!folder.isDirectory()) continue;
		const manifest = join(registryRoot, folder.name, 'registry.json');
		const content = await readFile(manifest, 'utf8').catch((error) => {
			if (error.code === 'ENOENT') return null;
			throw error;
		});
		if (!content) continue;
		const id = JSON.parse(content).id;
		const output = run(process.execPath, [cli, 'add', id], directory, 'y\ny\n');
		if (!output.includes(`Installed ${id}`))
			throw new Error(`CLI did not install ${id}: ${output}`);
		count++;
	}
	if (count !== 19) throw new Error(`Expected 19 copied components; found ${count}.`);
	const bin = (name) => join(directory, 'node_modules/.bin', name);
	run(bin('vite'), ['build', '--config', 'vite.svelte.config.ts']);
	await writeFile(
		join(directory, 'tsconfig.json'),
		JSON.stringify({
			extends: '$app/tsconfig',
			compilerOptions: {
				strict: true,
				allowImportingTsExtensions: true,
				moduleResolution: 'bundler'
			},
			include: ['src', 'vite.config.ts']
		})
	);
	run(bin('svelte-kit'), ['sync']);
	run(bin('svelte-check'), ['--tsconfig', './tsconfig.json', '--fail-on-warnings']);
	run(bin('vite'), ['build']);
	server = spawn(
		bin('vite'),
		['preview', '--host', '127.0.0.1', '--port', '4173', '--strictPort'],
		{
			cwd: directory,
			stdio: 'inherit'
		}
	);
	server.on('exit', (code) => void cleanup(code ?? 1));
	server.on('error', (error) => {
		console.error(error);
		void cleanup(1);
	});
} catch (error) {
	console.error(error);
	await cleanup(1);
}
