export default {
	purpose: 'Compose a native table with caption, headers, rich cells and theme-aware styling.',
	example:
		'<Table><caption>Orders</caption><thead><tr><th scope="col">Order</th></tr></thead><tbody><tr><td>#1042</td></tr></tbody></Table>',
	props: 'children?: Snippet; native HTMLTableAttributes, events, class and style are forwarded'
};
