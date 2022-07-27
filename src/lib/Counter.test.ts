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
