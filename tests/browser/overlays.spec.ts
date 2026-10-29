import { test, expect } from './fixture';

test('dialog traps focus, closes with Escape and restores the trigger', async ({ page }) => {
	const trigger = page.getByRole('button', { name: 'Open dialog', exact: true });
	const dialog = page.getByRole('dialog', { name: 'Confirmation' });
	for (let iteration = 0; iteration < 3; iteration++) {
		await trigger.click();
		await expect(dialog).toBeVisible();
		await dialog.getByRole('button', { name: 'Close dialog' }).focus();
		await page.keyboard.press('Tab');
		await expect(dialog.getByRole('button', { name: 'Confirm', exact: true })).toBeFocused();
		await trigger.focus();
		await expect(dialog.getByRole('button', { name: 'Confirm', exact: true })).toBeFocused();
		await page.keyboard.press('Escape');
		await expect(dialog).not.toBeVisible();
		await expect(trigger).toBeFocused();
	}
});

test('locked dialogs reject Escape and can close through their bound state', async ({ page }) => {
	const trigger = page.getByRole('button', { name: 'Open locked dialog' });
	await trigger.click();
	const dialog = page.getByRole('dialog', { name: 'Confirmation' });
	await page.keyboard.press('Escape');
	await expect(dialog).toBeVisible();
	await dialog.getByRole('button', { name: 'Confirm', exact: true }).click();
	await expect(dialog).not.toBeVisible();
	await expect(trigger).toBeFocused();
});

test('reopening a dialog during its closing transition keeps it usable', async ({ page }) => {
	await page.getByRole('button', { name: 'Open dialog', exact: true }).click();
	const dialog = page.getByRole('dialog', { name: 'Confirmation' });
	await dialog.getByRole('button', { name: 'Reopen dialog' }).click();
	await expect(page.getByTestId('reopened')).toHaveText('1');
	await expect(dialog).toBeVisible();
	await dialog.getByRole('button', { name: 'Confirm', exact: true }).click();
	await expect(dialog).not.toBeVisible();
});

test('popover supports Escape, outside dismissal and repeated opening', async ({ page }) => {
	const trigger = page.getByRole('button', { name: 'Open popover', exact: true });
	const action = page.getByRole('button', { name: 'Popover action' });
	for (let iteration = 0; iteration < 3; iteration++) {
		await trigger.click();
		await expect(action).toBeVisible();
		await action.focus();
		await page.keyboard.press('Escape');
		await expect(action).not.toBeVisible();
		await expect(trigger).toBeFocused();
	}
	await trigger.click();
	await page.getByRole('heading', { name: 'Bref consumer' }).click();
	await expect(action).not.toBeVisible();
});
