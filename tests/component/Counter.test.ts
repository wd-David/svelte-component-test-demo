import { test, expect } from '@playwright/experimental-ct-svelte';
import Counter from '$lib/Counter.svelte';

test('Test Counter.svelte', async ({ page, mount }) => {
	await mount(Counter);
	// Initial counter is "0"
	await expect(page.locator('.counter-digits > strong:nth-child(2)')).toContainText('0');
	// Decrease the counter
	await page.locator('[aria-label="Decrease the counter by one"]').dblclick();
	await expect(page.locator('.counter-digits > strong:nth-child(2)')).toContainText('-2');
	// Increase the counter
	await page.locator('[aria-label="Increase the counter by one"]').click();
	await expect(page.locator('.counter-digits > strong:nth-child(2)')).toContainText('-1');
});
