import type { PlaywrightTestConfig } from '@playwright/experimental-ct-svelte';
import ctViteConfig from './vite.config.js'

const config: PlaywrightTestConfig = {
	testDir: 'tests/component',
	use: {
		ctViteConfig
	}
};

export default config;
