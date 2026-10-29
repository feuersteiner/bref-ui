import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: './tests/browser',
	forbidOnly: !!process.env.CI,
	workers: 2,
	reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
	use: {
		baseURL: 'http://127.0.0.1:4173',
		browserName: 'chromium',
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure'
	},
	projects: [{ name: 'package' }, { name: 'copy' }],
	webServer: {
		command: 'node tests/consumer-server.mjs',
		url: 'http://127.0.0.1:4173/package',
		timeout: 240_000,
		gracefulShutdown: { signal: 'SIGTERM', timeout: 5_000 },
		reuseExistingServer: false
	}
});
