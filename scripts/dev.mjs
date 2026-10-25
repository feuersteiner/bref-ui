import { spawn, spawnSync } from 'node:child_process';

// Package public exports before Vite resolves the linked libraries.
const build = spawnSync('bun', ['run', 'build:packages'], { stdio: 'inherit' });
if (build.status !== 0) process.exit(build.status ?? 1);

const children = [];
let stopping = false;
const stop = (code) => {
	if (stopping) return;
	stopping = true;
	process.exitCode = code;
	for (const child of children)
		try {
			if (process.platform === 'win32') child.kill('SIGTERM');
			else process.kill(-child.pid, 'SIGTERM');
		} catch (error) {
			if (error.code !== 'ESRCH') console.error(error.message);
		}
};

process.once('SIGINT', () => stop(0));
process.once('SIGTERM', () => stop(0));

const start = (directory, command, args = []) =>
	new Promise((resolve, reject) => {
		let ready = command !== 'watch';
		let output = '';
		const child = spawn('bun', ['run', '--cwd', directory, command, ...args], {
			stdio: ['inherit', ready ? 'inherit' : 'pipe', 'inherit'],
			detached: process.platform !== 'win32'
		});
		children.push(child);
		if (ready) resolve();
		else
			child.stdout.on('data', (chunk) => {
				process.stdout.write(chunk);
				if (ready) return;
				output += chunk.toString();
				if (output.includes('for changes...')) {
					ready = true;
					resolve();
				}
			});
		child.once('error', (error) => {
			reject(error);
			stop(1);
		});
		child.once('exit', (code, signal) => {
			if (!ready) reject(new Error(`${directory} watcher exited before becoming ready.`));
			if (!stopping) stop(code ?? (signal ? 1 : 0));
		});
	});

try {
	// Initial watch builds must finish before the docs server loads their exports.
	await Promise.all([start('core', 'watch'), start('themes', 'watch')]);
	if (!stopping) await start('docs', 'dev', process.argv.slice(2));
} catch (error) {
	console.error(error.message);
	stop(1);
}
