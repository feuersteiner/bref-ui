import { test, expect } from './fixture';

test('theme TreeViews retain valid control targets and popovers honor early Escape', async ({
	page
}) => {
	await page.goto('/themes');
	await expect(page.locator('main')).toHaveAttribute('data-ready', 'true');
	for (const name of ['New Paris', 'Glassy', 'Crystal Code', 'VS Code']) {
		const section = page.getByRole('region', { name, exact: true });
		const toggle = section.getByRole('button', { name: 'Children of Parent' });
		const id = await toggle.getAttribute('aria-controls');
		expect(id).toBeTruthy();
		const children = section.locator(`[id="${id}"]`);
		await expect(children).toHaveCount(1);
		await toggle.click();
		await expect(children.getByRole('button', { name: 'Child', exact: true })).toBeVisible();
		await toggle.press('Enter');
		await expect(toggle).toHaveAttribute('aria-expanded', 'false');
		await expect(children.getByRole('button', { name: 'Child', exact: true })).toHaveCount(0);
		const trigger = section.getByRole('button', { name: 'Open popover' });
		for (let iteration = 0; iteration < 3; iteration++) {
			await trigger.click();
			const action = section.getByRole('button', { name: 'Popover action' });
			await expect(action).toBeVisible();
			await action.focus();
			await page.keyboard.press('Escape');
			await expect(action).not.toBeVisible();
			await expect(trigger).toBeFocused();
		}
	}
});
