import { test, expect } from './fixture';

test('combobox keyboard selection skips disabled options and submits native values', async ({
	page
}) => {
	const destination = page.getByRole('combobox', { name: 'Destination' });
	await destination.focus();
	await destination.press('ArrowDown');
	await destination.press('ArrowDown');
	await destination.press('Enter');
	await expect(destination).toHaveValue('Beta');
	await expect(destination).toHaveAttribute('aria-expanded', 'false');
	await page.getByLabel('Agree', { exact: true }).check();
	await page.getByLabel('Notify', { exact: true }).check();
	await page.getByRole('button', { name: 'Submit', exact: true }).click();
	await expect(page.getByTestId('submitted')).toHaveText(
		JSON.stringify([
			['title', 'Initial'],
			['notes', 'Notes'],
			['agree', 'yes'],
			['notify', 'yes'],
			['destination', 'b'],
			['tags', 'a']
		])
	);
});

test('multiple selection, query cancellation and form reset preserve initial values', async ({
	page
}) => {
	const tags = page.getByRole('combobox', { name: 'Tags', exact: true });
	await tags.fill('Beta');
	await tags.press('ArrowDown');
	await tags.press('Enter');
	await expect(tags).toHaveAttribute('aria-expanded', 'true');
	await tags.press('Escape');
	await expect(tags).toHaveValue('Alpha, Beta');
	await tags.fill('No match');
	await expect(page.getByRole('option')).toHaveCount(0);
	await tags.press('Escape');
	await expect(tags).toHaveValue('Alpha, Beta');
	await page.getByLabel('Title', { exact: true }).fill('Edited');
	await page.getByLabel('Notes', { exact: true }).fill('Edited notes');
	await page.getByLabel('Agree', { exact: true }).check();
	await page.getByRole('button', { name: 'Reset', exact: true }).click();
	await expect(tags).toHaveValue('Alpha');
	await expect(page.getByLabel('Title', { exact: true })).toHaveValue('Initial');
	await expect(page.getByLabel('Notes', { exact: true })).toHaveValue('Notes');
	await expect(page.getByLabel('Agree', { exact: true })).not.toBeChecked();
});

test('required, disabled and readonly controls retain native behavior', async ({ page }) => {
	await expect(page.getByLabel('Locked', { exact: true })).toBeDisabled();
	const readonly = page.getByLabel('Read only', { exact: true });
	await readonly.focus();
	await readonly.press('ArrowDown');
	await readonly.press('Backspace');
	await expect(readonly).toHaveValue('Alpha');
	await expect(readonly).toHaveAttribute('aria-expanded', 'false');
	await page.getByRole('button', { name: 'Clear destination' }).click();
	await page.getByRole('button', { name: 'Submit', exact: true }).click();
	await expect(page.getByRole('combobox', { name: 'Destination' })).toBeFocused();
	await expect(page.getByTestId('submitted')).toBeEmpty();
});
