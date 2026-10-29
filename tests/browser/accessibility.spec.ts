import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './fixture';

test('all package and copied exports load, and SSR provides usable content', async ({
	page,
	request
}, info) => {
	const counts = (await page.getByTestId('exports').innerText()).split(',').map(Number);
	expect(counts).toHaveLength(6);
	for (const count of counts) expect(count).toBeGreaterThanOrEqual(19);
	const response = await request.get(`/${info.project.name}`);
	expect(response.ok()).toBe(true);
	const html = await response.text();
	expect(html).toContain('Bref consumer');
	expect(html).toContain('role="tablist"');
	expect(html).toContain('name="destination"');
});

test('tabs support arrows, Home, End, RTL and disabled items', async ({ page }) => {
	const alpha = page.getByRole('tab', { name: 'Alpha', exact: true });
	const beta = page.getByRole('tab', { name: 'Beta', exact: true });
	await expect(page.getByRole('tab', { name: 'Blocked' })).toBeDisabled();
	await alpha.focus();
	await alpha.press('ArrowRight');
	await expect(beta).toBeFocused();
	await expect(beta).toHaveAttribute('aria-selected', 'true');
	await beta.press('Home');
	await expect(alpha).toBeFocused();
	await alpha.press('End');
	await expect(beta).toBeFocused();
	await page.getByRole('tablist').evaluate((element) => element.setAttribute('dir', 'rtl'));
	await beta.press('ArrowRight');
	await expect(alpha).toBeFocused();
	await expect(page.getByTestId('tab-value')).toHaveText('a');
});

test('TreeView expansion controls reference the actual children', async ({ page }) => {
	const toggle = page.getByRole('button', { name: 'Children of Parent' });
	const id = await toggle.getAttribute('aria-controls');
	expect(id).toBeTruthy();
	const children = page.locator(`[id="${id}"]`);
	await expect(children).toBeAttached();
	await toggle.click();
	await expect(toggle).toHaveAttribute('aria-expanded', 'true');
	await expect(children.getByRole('button', { name: 'Child', exact: true })).toBeVisible();
	await toggle.press('Enter');
	await expect(toggle).toHaveAttribute('aria-expanded', 'false');
	await expect(children).toHaveAttribute('aria-hidden', 'true');
	await expect(children.getByRole('button', { name: 'Child', exact: true })).toHaveCount(0);
});

test('default, expanded combobox and dialog states pass accessibility checks', async ({ page }) => {
	const scan = async () => {
		await page.locator('body').evaluate(async (body) => {
			await Promise.allSettled(
				body.getAnimations({ subtree: true }).map((animation) => animation.finished)
			);
		});
		const { violations } = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
			.analyze();
		expect(violations).toEqual([]);
	};
	await scan();
	await page.getByRole('combobox', { name: 'Destination' }).press('ArrowDown');
	await scan();
	await page.keyboard.press('Escape');
	await page.getByRole('button', { name: 'Open dialog', exact: true }).click();
	await scan();
});
