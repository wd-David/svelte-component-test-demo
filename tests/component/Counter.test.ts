import { test, expect } from '@playwright/experimental-ct-svelte';
import Counter from '$lib/Counter.svelte';

test('Test Counter.svelte', async ({ mount }) => {
	const component = await mount(Counter);
	// Initial counter is "0"
	await expect(component).toContainText("0");
	// Decrease the counter
	await component.locator('[aria-label="Decrease the counter by one"]').dblclick();
	await expect(component).toContainText('-2');
	// Increase the counter
	await component.locator('[aria-label="Increase the counter by one"]').click();
	await expect(component).toContainText('-1');
});
