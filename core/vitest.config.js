import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		include: ['tests/**/*.test.js'],
		// Package fixtures rebuild the same canonical dist and example validation directory.
		fileParallelism: false,
		testTimeout: 30_000,
		hookTimeout: 120_000
	}
});
