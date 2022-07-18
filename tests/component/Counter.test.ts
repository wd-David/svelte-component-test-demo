import { test, expect } from '@playwright/experimental-ct-svelte';
import Counter from '$lib/Counter.svelte';

test('Test Counter.svelte', async ({ page, mount }) => {
	await mount(Counter);
	// Initial counter is "0"
	await expect(page.locator('text="0"'), 'Should be 0').toBeVisible();
	// Decrease the counter
	await page.locator('[aria-label="Decrease the counter by one"]').dblclick();
	await expect(page.locator('text="-2"'), 'Should be -2').toBeVisible();
	// Increase the counter
	await page.locator('[aria-label="Increase the counter by one"]').click();
	await expect(page.locator('text="-1"'), 'Should be -1').toBeVisible();
});
