# Test Svelte Component Using Vitest or Playwright (or Both!)

> [Svelte Component Test Demo Repo](https://github.com/davipon/svelte-component-test-demo)

## Different types of test

- Unit Test
- Component Test/ Integration Test
- End-to-end (E2E) test

## Test Runners

- Vitest
- Playwright

## Vitest + `@testing-library/svelte`

- [svelte-add-vitest](https://github.com/davipon/svelte-add-vitest)
- Dependencies
- Share the same `vite.config.js`

## Playwright Expermimental Component Test

[Experimental: components](https://playwright.dev/docs/test-components#how-to-get-started)

- Use `vite` under the hood
- Less dependencies

### Use Svelte Demo Project

1. `npm create svelte my-app`

2. `npm install @playwright/experimental-ct-svelte`

3. Create a folder `playwright` under your project root folder


## Vitest (as test runner) + Playwright

[Use Playwright with Vitest as test runner](https://github.com/vitest-dev/vitest/tree/main/examples/playwright)

## Comparison

| Unit Test | Component/ Integration Test | E2E Test |
| --------- | ----------- | ------- |
| Vitest      |`vitest` + `@testing-library/svelte` or `@playwright/experimental-ct-svelte`| Playwright   |

## Resources

### Articles

- [Unit Testing Svelte Components](https://sveltesociety.dev/recipes/testing-and-debugging/unit-testing-svelte-component)
- [Testing a Svelte app with Vitest](https://blog.logrocket.com/testing-svelte-app-vitest/)

### Videos

- [Test SvelteKit with Playwright 🧪 LIVE Coding & Chill](https://youtu.be/Me6qEMzmlaU)
- [Testing in Svelte by Jess Sachs (Svelte Sirens)](https://youtu.be/-GKRH0KQ_j0)