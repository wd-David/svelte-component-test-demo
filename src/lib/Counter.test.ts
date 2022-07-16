import { render, fireEvent, screen } from '@testing-library/svelte';
import Counter from './Counter.svelte';

describe('Test Counter.svelte', async () => {
	it('Initial counter should be 0', async () => {
		render(Counter);

		const counter = await screen.findByText('0')
		expect(counter).toBeInTheDocument();
	});
	it('Test decrease', async () => {
		render(Counter);

		const decreaseButton = screen.getByLabelText('Decrease the counter by one')

		await fireEvent.click(decreaseButton);
		await fireEvent.click(decreaseButton);

		const counter = await screen.findByText('-2')
		expect(counter).toBeInTheDocument();

	});
	it('Test increase', async () => {
		render(Counter);

		const increaseButton = screen.getByLabelText('Increase the counter by one')

		await fireEvent.click(increaseButton);

		const counter = await screen.findByText('1')
		expect(counter).toBeInTheDocument();
	});
});
