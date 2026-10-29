import { test as base, expect } from '@playwright/test';

interface Fixtures {
	runtimeErrors: string[];
}

export const test = base.extend<Fixtures>({
	runtimeErrors: [
		async ({ page }, use, info) => {
			const errors: string[] = [];
			page.on('pageerror', (error) => errors.push(error.message));
			page.on('console', (message) => {
				if (message.type() === 'error' || /hydration/i.test(message.text()))
					errors.push(message.text());
			});
			await page.goto(`/${info.project.name}`);
			await expect(page.locator('main')).toHaveAttribute('data-ready', 'true');
			await use(errors);
			expect(errors, 'No runtime errors or hydration warnings').toEqual([]);
		},
		{ auto: true }
	]
});

export { expect };
