# Test Svelte Component Using Vitest & Playwright (WIP )

Hi 👋, I'm David Peng.
It's been a while since my last blog post.

In the last two months, I added 100+ unit/ component/ e2e tests in my Svelte project (yeah, I didn't do TDD because I wasn't familiar with testing enough 😅).
I experimented with different test runners, kept measuring DX and try to find my ideal toolset of testing. I'd love to share some of my learnings and thoughts here.

In this article I'll focus on the basic setup of Vitest & Playwright to test our Svelte components. You can check the demo repo here: [Svelte Component Test Demo Repo](https://github.com/davipon/svelte-component-test-demo)

I'll also write about the advanced component test and mocking (Svelte runtime module & networking) in my next blog post, stay tuned!

## Different types of test in Svelte

Here's a breif introduction of each type (my point of view):

- **Unit Test**: Test the smallest piece of code, e.g., a simple function.
- **Integration Test**: Test group of functions, e.g., fetching and transforming data
- **Component Test**: Test the behavior/ transition of a UI component, e.g., form validation
- **End-to-end (E2E) test**: Complete user journey, e.g., login to a website and a series of operations

## Test Runners

### [Vitest](https://vitest.dev/): A Vite-native unit test framework. (alternative: [Jest](https://jestjs.io/))

You might hear that more and more Svelte Developers migrating their tests from Jest to Vitest in the past few months.
> A great read here: [Testing a Svelte app with Vitest](https://blog.logrocket.com/testing-svelte-app-vitest/)

Vitest is way faster because of Vite and it's a great fit with SvelteKit (use vite under the hood). Another plus is you can remove most of your babel stuff 🎊.

### [Playwright](https://playwright.dev/): A framework for Web Testing and Automation. (alternative: [Cypress](https://www.cypress.io/))



### When to use each test runners?

| Unit Test | Component Test | E2E Test |
| --------- | ----------- | ------- |
| Vitest      |`vitest` + `@testing-library/svelte` or `@playwright/experimental-ct-svelte`| Playwright   |

## Vitest + `@testing-library/svelte`

> You can follow below steps to setup Vitest or use the Svelte Adder: [svelte-add-vitest](https://github.com/davipon/svelte-add-vitest)

### Take Svelte Demo App (TypeScript) for example

1. `npm install -D vitest jsdom @testing-library/svelte`
2. `npm install -D @testing-library/jest-dom @types/testing-library__jest-dom` (optional but recommended)
3. Configure Vitest in `vite.config.js`:
```js
import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()],
  /** Add below settings */
  test: {
    // Jest like globals
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.ts'],
    // Extend jest-dom matchers
    setupFiles: ['./setupTest.js']
  }
};

export default config;
```
4. Create `setupTest.js` and extend `jest-dom` asserions/ matchers in Vitest:
```js
import matchers from '@testing-library/jest-dom/matchers';
import { expect, vi } from 'vitest';

expect.extend(matchers);
```

> The reason to use `jest-dom` assertions can be found here: [Common mistakes with React Testing Library #Using the wrong assertion](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library#using-the-wrong-assertion)

5. Add `types` in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  }
}
```

6. Create `src/lib/Counter.test.ts`:
```ts
import { render, fireEvent, screen } from '@testing-library/svelte';
import Counter from './Counter.svelte';

describe('Test Counter.svelte', async () => {
  it('Initial counter should be 0', async () => {
    render(Counter);

    const counter = await screen.findByText('0');
    expect(counter).toBeInTheDocument();
  });
  it('Test decrease', async () => {
    render(Counter);

    const decreaseButton = screen.getByLabelText('Decrease the counter by one');

    await fireEvent.click(decreaseButton);
    await fireEvent.click(decreaseButton);

    const counter = await screen.findByText('-2');
    expect(counter).toBeInTheDocument();
  });
  it('Test increase', async () => {
    render(Counter);

    const increaseButton = screen.getByLabelText('Increase the counter by one');

    await fireEvent.click(increaseButton);

    const counter = await screen.findByText('1');
    expect(counter).toBeInTheDocument();
  });
});

```

> The benefit of using `screen` is you no longer need to keep the render call destructure up-to-date as you add/remove the queries you need. You only need to type screen. and let your editor's magic autocomplete take care of the rest. (ref: [Common mistakes with React Testing Library #Not using `screen`](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library#not-using-screen))

7. Add `test` script in `package.json`:
```json
{
  "scripts": {
    "test": "vitest"
  }
}
```
![execute vitest](https://drive.google.com/uc?id=1bGiNIes5IGHV7wn0TdfTZ-xm7RfNAyjr)

## Playwright Experimental Component Test

This experimental component test is powered by Vite, for more details please read the doc and the overview video from Playwright:

- [Experimental: components](https://playwright.dev/docs/test-components#how-to-get-started)

- [[Youtube]Playwright 1.22: Component Tests (preview) Overview](https://www.youtube.com/watch?v=y3YxX4sFJbM&ab_channel=Playwright)


### Take Svelte Demo App (TypeScript) for example

1. `npm create svelte my-app` and choose the Demo Project
2. `npm install -D @playwright/experimental-ct-svelte`
3. Create `playwright-ct.config.ts`

```ts
import type { PlaywrightTestConfig } from '@playwright/experimental-ct-svelte';
import { resolve } from 'node:path';

const config: PlaywrightTestConfig = {
  testDir: 'tests/component',
  use: {
    ctViteConfig: {
      resolve: {
        alias: {
          // Setup the built-in $lib alias in SvelteKit
          $lib: resolve('src/lib')
        }
      }
    }
  }
};

export default config;
```

4. Create several files in your Svelte porject workspace:

`playwright/index.html`

```html
<html lang="en">
  <body>
    <div id="root"></div>
    <script type="module" src="/playwright/index.js"></script>
  </body>
</html>
```

`playwright/index.js`

```js
// Apply theme here, add anything your component needs at runtime here.
// Here we import the demo project's css file
import '../src/app.css';
```

5. Create `tests/component/Counter.test.ts`

`@playwright/experimental-ct-svelte` wrap `@playwright/test` to provide an additional built-in component-testing specific fixture called `mount`

```ts
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

```

Your VS Code may show an error like this:

![ts-error-svelte](https://drive.google.com/uc?id=15UPL1qoXCywR_rW4FQ4xQRVGY8bhR9vT)

We can solve this by adding `include` in your `tsconfig.json`:
```json
{
  "include": ["tests/**/*.ts"]
}
```

6. Add `test:com` script in `package.json`

```json
{
  "scripts": {
    "test:com": "playwright test -c playwright-ct.config.ts"
  }
}
```
![execute component test](https://drive.google.com/uc?id=10JZKYlqk1TtNdWW4ykb_TujP-N4dKR9Z)

## Vitest (as test runner) + Playwright

I haven't tried this combination in my projects, but you can check the example from the Vitest GitHub repo: [Use Playwright with Vitest as test runner](https://github.com/vitest-dev/vitest/tree/main/examples/playwright)

## Wrapping Up

I've always tried to avoid writing tests that "reverse engineer" the functionality of complex functions or components, something like writing a helper function which has more lines of code than the function I want to test, or create yet another wrapper component just to test your component.

It doesn't make sense to me to mock how a framework mounts a component instead of testing it from a user's perspective.



## Resources

### Issues

[Shim SvelteKit runtime import aliases / Importing $app/* fails #1485](https://github.com/sveltejs/kit/issues/1485)

### Articles

- [Unit Testing Svelte Components (Svelte Society)](https://sveltesociety.dev/recipes/testing-and-debugging/unit-testing-svelte-component)
- [Testing a Svelte app with Vitest](https://blog.logrocket.com/testing-svelte-app-vitest/)

### Videos

- [[Youtube]Test SvelteKit with Playwright 🧪 LIVE Coding & Chill](https://youtu.be/Me6qEMzmlaU)
- [[Youtube]Testing in Svelte by Jess Sachs (Svelte Sirens)](https://youtu.be/-GKRH0KQ_j0)