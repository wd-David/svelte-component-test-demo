import { render, screen } from '@testing-library/svelte';
import Header from './Header.svelte';

it('Render About page', () => {
	render(Header);

	const home = screen.getByText('Home');
	expect(home).toBeInTheDocument();

	const about = screen.getByText('About');
	expect(about).toBeInTheDocument();

	const todo = screen.getByText('Todos');
	expect(todo).toBeInTheDocument();
});
