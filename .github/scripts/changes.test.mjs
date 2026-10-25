import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { getChanges } from './changes.mjs';

const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
const write = (cwd, file, value) => {
	const target = join(cwd, file);
	mkdirSync(join(target, '..'), { recursive: true });
	writeFileSync(target, typeof value === 'string' ? value : JSON.stringify(value));
};
const commit = (cwd) => {
	git(cwd, 'add', '.');
	git(cwd, 'commit', '--quiet', '-m', 'chore🧪: update fixture');
	return git(cwd, 'rev-parse', 'HEAD');
};
const fixture = (t, legacy = false) => {
	const cwd = mkdtempSync(join(tmpdir(), 'bref-ci-'));
	t.after(() => rmSync(cwd, { recursive: true, force: true }));
	git(cwd, 'init', '--quiet');
	git(cwd, 'config', 'user.name', 'CI fixture');
	git(cwd, 'config', 'user.email', 'fixture@example.invalid');
	git(cwd, 'config', 'commit.gpgsign', 'false');
	git(cwd, 'config', 'core.hooksPath', '/dev/null');
	write(cwd, 'package.json', legacy ? { name: 'bref-ui', version: '2.2.3' } : { private: true });
	if (!legacy) {
		write(cwd, 'core/package.json', { name: 'bref-ui', version: '3.0.0' });
		write(cwd, 'themes/package.json', { name: 'bref-ui-themes', version: '0.0.1' });
	}
	const before = commit(cwd);
	return { cwd, before };
};

test('documentation changes deploy without publishing libraries', (t) => {
	const { cwd, before } = fixture(t);
	write(cwd, 'docs/src/routes/+page.svelte', '<h1>Docs</h1>');
	commit(cwd);
	assert.deepEqual(getChanges(before, cwd), { core: false, themes: false, docs: true });
});
test('library source or manifest script changes without bumps do not publish or deploy', (t) => {
	const { cwd, before } = fixture(t);
	write(cwd, 'core/src/lib/index.ts', '// Source change');
	write(cwd, 'core/package.json', {
		name: 'bref-ui',
		version: '3.0.0',
		scripts: { check: 'true' }
	});
	commit(cwd);
	assert.deepEqual(getChanges(before, cwd), { core: false, themes: false, docs: false });
});
test('core version bump publishes core and deploys docs', (t) => {
	const { cwd, before } = fixture(t);
	write(cwd, 'core/package.json', { name: 'bref-ui', version: '3.0.1' });
	commit(cwd);
	assert.deepEqual(getChanges(before, cwd), { core: true, themes: false, docs: true });
});
test('themes version bump publishes themes and deploys docs', (t) => {
	const { cwd, before } = fixture(t);
	write(cwd, 'themes/package.json', { name: 'bref-ui-themes', version: '0.1.0' });
	commit(cwd);
	assert.deepEqual(getChanges(before, cwd), { core: false, themes: true, docs: true });
});
test('private packages cannot trigger publishing', (t) => {
	const { cwd, before } = fixture(t);
	write(cwd, 'core/package.json', { name: 'bref-ui', version: '3.0.1', private: true });
	commit(cwd);
	assert.equal(getChanges(before, cwd).core, false);
});
test('migration compares core with the old root package and skips the new themes scaffold', (t) => {
	const { cwd, before } = fixture(t, true);
	write(cwd, 'package.json', { name: 'bref-ui-workspace', private: true });
	write(cwd, 'core/package.json', { name: 'bref-ui', version: '3.0.0' });
	write(cwd, 'themes/package.json', { name: 'bref-ui-themes', version: '0.0.1' });
	commit(cwd);
	assert.deepEqual(getChanges(before, cwd), { core: true, themes: false, docs: true });
});
test('initial push does not auto-publish scaffolds', (t) => {
	const { cwd } = fixture(t);
	assert.deepEqual(getChanges('0'.repeat(40), cwd), { core: false, themes: false, docs: false });
});
test('invalid previous commit fails instead of allowing publishing', (t) => {
	const { cwd } = fixture(t);
	assert.throws(() => getChanges('missing-ref', cwd));
});

test('version rollbacks do not publish or deploy', (t) => {
	const { cwd, before } = fixture(t);
	write(cwd, 'core/package.json', { name: 'bref-ui', version: '2.2.3' });
	commit(cwd);
	assert.deepEqual(getChanges(before, cwd), { core: false, themes: false, docs: false });
});
