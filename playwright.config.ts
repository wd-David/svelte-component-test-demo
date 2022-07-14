import type { PlaywrightTestConfig } from '@playwright/experimental-ct-svelte';
import { resolve } from 'path';

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},
	testMatch: 'tests/**/*.ts',
	use: {
		ctViteConfig: {
			resolve: {
				alias: {
					$lib: resolve('src/lib')
				}
			}
		}
	}
};

export default config;
