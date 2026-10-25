import { execFileSync, spawnSync } from 'node:child_process';
import { appendFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

/** Detect documentation changes and explicit version bumps against a push's previous commit. */
export const getChanges = (before, cwd = process.cwd()) => {
	const hasBefore = Boolean(before && !/^0+$/.test(before));
	if (hasBefore)
		execFileSync('git', ['rev-parse', '--verify', `${before}^{commit}`], { cwd, stdio: 'pipe' });
	const paths = execFileSync(
		'git',
		hasBefore ? ['diff', '--name-only', before, 'HEAD'] : ['ls-files'],
		{ cwd, encoding: 'utf8' }
	).split('\n');
	const result = {};
	for (const directory of ['core', 'themes']) {
		const current = JSON.parse(readFileSync(join(cwd, directory, 'package.json'), 'utf8'));
		let previous;
		if (hasBefore)
			// The original single-package repository kept bref-ui's manifest at its root.
			for (const path of [`${directory}/package.json`, 'package.json']) {
				const file = spawnSync('git', ['show', `${before}:${path}`], { cwd, encoding: 'utf8' });
				if (file.status !== 0) continue;
				const manifest = JSON.parse(file.stdout);
				if (manifest.name === current.name) {
					previous = manifest;
					break;
				}
			}

		const previousParts = previous?.version.split('.').map(Number);
		const difference = previousParts
			? (current.version
					.split('.')
					.map((part, index) => Number(part) - previousParts[index])
					.find((part) => part !== 0) ?? 0)
			: 0;
		// New scaffolds and version rollbacks must not trigger a package release.
		result[directory] = !current.private && difference > 0;
	}
	result.docs = paths.some((path) => path.startsWith('docs/')) || result.core || result.themes;
	return result;
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	const result = getChanges(process.env.BEFORE);
	const output = Object.entries(result)
		.map(([name, changed]) => `${name}=${changed}\n`)
		.join('');
	if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, output);
	console.log(output.trimEnd());
}
