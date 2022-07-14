import { render, fireEvent, waitFor } from '@testing-library/svelte';
import Counter from './Counter.svelte';

describe('Test Counter.svelte', async () => {
	it('Initial counter should be 0', () => {
		const { container } = render(Counter);

		const counter = container.querySelector('.counter-digits > strong:nth-child(2)')?.innerHTML;
		expect(counter).toEqual('0');
	});
	it('Test decrease', async () => {
		const { container } = render(Counter);

		const decreaseButton = container.querySelector(
			'button[aria-label="Decrease the counter by one"]'
		) as HTMLButtonElement;

		await fireEvent.click(decreaseButton);
		await fireEvent.click(decreaseButton);

		await waitFor(() => {
			const counter = container.querySelector('.counter-digits > strong:nth-child(2)')?.innerHTML;
			expect(counter).toEqual('-2');
		});
	});
	it('Test increase', async () => {
		const { container } = render(Counter);

		const increaseButton = container.querySelector(
			'button[aria-label="Increase the counter by one"]'
		) as HTMLButtonElement;

		await fireEvent.click(increaseButton);

		await waitFor(() => {
			const counter = container.querySelector('.counter-digits > strong:nth-child(2)')?.innerHTML;
			expect(counter).toEqual('1');
		});
	});
});
