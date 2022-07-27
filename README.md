# svelte-component-test-demo

The blog post is published at Hashnode: [Test Svelte Component Using Vitest & Playwright](https://davipon.hashnode.dev/test-svelte-component-using-vitest-playwright)

---

# Test Svelte Component Using Vitest & Playwright

Hi 👋, I'm David Peng.
It's been a while since my last blog post.

In the last two months, I added 100+ unit/ component/ e2e tests in my Svelte project (yeah, I didn't do TDD because I wasn't familiar with testing enough 😅).
I experimented with different test runners, kept measuring DX, and tried to find my ideal toolset for testing. I'd love to share some of my learnings and thoughts here.

In this article, I'll focus on the basic setup of Vitest & Playwright to test our Svelte components. You can check the demo repo here: [Svelte Component Test Demo Repo](https://github.com/davipon/svelte-component-test-demo)

In my next blog post, I'll also write about the advanced component test and mocking (Svelte runtime module & networking). Stay tuned!

## Different types of test

Here's a brief introduction of each type (my point of view):

- **Unit Test**: Test the smallest piece of code, e.g., a simple function.
- **Integration Test**: Test group of functions, e.g., fetching and transforming data
- **Component Test**: Test the behavior/ transition of a UI component, e.g., form interaction, open a modal
- **End-to-end (E2E) test**: Complete user journey, e.g., login to a website and a series of operations

## Test Runners

### [Vitest](https://vitest.dev/): A Vite-native unit test framework. (alternative: [Jest](https://jestjs.io/), [uvu](https://github.com/lukeed/uvu))

You might hear more Svelte Developers migrating their tests from Jest to Vitest in the past few months.

Vitest is way faster than Jest because of Vite goodness, and it's a great fit with SvelteKit (use vite under the hood). Another plus is you can remove all your jest/ babel config 🎊.

> A great read here: [Testing a Svelte app with Vitest](https://blog.logrocket.com/testing-svelte-app-vitest/)

### [Playwright](https://playwright.dev/): A framework for Web Testing and Automation. (alternative: [Cypress](https://www.cypress.io/))

Playwright is a recommended E2E test runner in the Svelte community. You can also find Playwright as an option in `create-svelte`.

### When to use each test runner?

Even though Vitest & Playwright are both test runners, they have a different focus and testing scenarios.

Vitest is incredibly fast because of its instant Hot Module Reload; it only reruns the test whenever the test, source code, or dependencies are changed, so it's suitable for the unit, integration tests.

While Playwright was created specifically for E2E testing, you need to build your Svelte app and start the server to test your app, which is much similar to the production.

But when it comes to the component test, we have a couple of choices:

- Unit testing runners like Vitest, Jest, or uvu + Testing Library
- Playwright/ Cypress component test (both powered by Vite)
- Storybook (I haven't tried it 😁)


| Unit Test | ✨ Component Test ✨ | E2E Test |
| --------- | ----------- | ------- |
| Vitest      |`vitest` + `@testing-library/svelte` or `@playwright/experimental-ct-svelte`| Playwright   |

Let's see how to test the Svelte component using Vitest & Playwright.

> Since we're going to talk about the component test, I like to share this clip from JS Party: [[Twitter]accidentally testable](https://twitter.com/jspartyfm/status/1551932536493953029?s=21&t=iZQN92C8IAr8EZAUtljCbQ), you can also listen to the episode #233



## Vitest + `@testing-library/svelte`

> You can follow the below steps to setup Vitest or use the Svelte Adder: [svelte-add-vitest](https://github.com/davipon/svelte-add-vitest)

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
4. Create `setupTest.js` and extend `jest-dom` assertions/ matchers in Vitest:
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
    expect(screen.getByText('0')).toBeInTheDocument();
  });
  it('Test decrease', async () => {
    render(Counter);
    const decreaseButton = screen.getByLabelText('Decrease the counter by one');
    // Decrease by two
    await fireEvent.click(decreaseButton);
    await fireEvent.click(decreaseButton);
    // Wait for animation
    const counter = await screen.findByText('-2');
    expect(counter).toBeInTheDocument();
  });
  it('Test increase', async () => {
    render(Counter);
    const increaseButton = screen.getByLabelText('Increase the counter by one');
    // Increase by one
    await fireEvent.click(increaseButton);
    // Wait for animation
    const counter = await screen.findByText('1');
    expect(counter).toBeInTheDocument();
  });
});

```

> The benefit of using `screen` is you no longer need to keep the render call destructure up-to-date as you add/remove the queries you need. You only need to type screen. And let your editor's magic autocomplete take care of the rest. (ref: [Common mistakes with React Testing Library #Not using `screen`](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library#not-using-screen))

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

This experimental component test is powered by Vite. For more details, please read the doc and the overview video from Playwright:

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

4. Create several files in your Svelte project workspace:

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
// Here, we import the demo project's css file
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

I've spent a considerable amount of time writing component tests using both Vitest & Playwright. Here are some of my thoughts and a reflection of DX (developer experience):

- **Vitest + Testing Library**: Setting up your testing environment takes more steps and dependencies. It also took me a while to grasp the concept and best practices of Testing Library and use query/ assertions properly, but once you have more confidence, you'd have a pleasant DX.
- **Playwright Experimental Component Test**: You can directly use most of Playwright's goodness like [fixtures](https://playwright.dev/docs/api/class-fixtures), [network intercepting](https://playwright.dev/docs/network), in your component test, and its syntax are intuitive and pretty handy. While it's still in the experimental phase, getting more stable may take a while.

In my opinion, Vitest + Testing Library would probably be a better choice at this moment. Despite that Vitest hasn't hit 1.0, my personal experience of migrating from Jest is pretty smooth. Also, Testing Library is stable and used by many companies.

Thank you for your reading.
You can follow me on Twitter [@davipon](https://twitter.com/davipon)

Please leave your thoughts and experience below. Love to hear your feedback!

## Resources

### Discussion

[sveltejs/kit: Vitest for unit testing #5285](https://github.com/sveltejs/kit/discussions/5285)

### Issues

[Shim SvelteKit runtime import aliases / Importing $app/* fails #1485](https://github.com/sveltejs/kit/issues/1485)

### Articles

- [Unit Testing Svelte Components (Svelte Society)](https://sveltesociety.dev/recipes/testing-and-debugging/unit-testing-svelte-component)
- [Testing a Svelte app with Vitest](https://blog.logrocket.com/testing-svelte-app-vitest/)
- [Component Driven User Interfaces](https://www.componentdriven.org/)

### Videos

- [[Youtube]Test SvelteKit with Playwright 🧪 LIVE Coding & Chill](https://youtu.be/Me6qEMzmlaU)
- [[Youtube]Testing in Svelte by Jess Sachs (Svelte Sirens)](https://youtu.be/-GKRH0KQ_j0)