import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		include: ['tests/**/*.test.js'],
		testTimeout: 30_000,
		hookTimeout: 120_000
	}
});
