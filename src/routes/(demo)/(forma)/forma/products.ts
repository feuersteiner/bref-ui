export interface Product {
	id: string;
	name: string;
	category: string;
	price: number;
	image: string;
	alt: string;
	description: string;
	finishes: string[];
}
export interface CartItem {
	key: string;
	product: Product;
	finish: string;
	quantity: number;
}
export const products: Product[] = [
	{
		id: 'lounge',
		name: 'Sunday chair',
		category: 'seating',
		price: 420,
		image: '/demos/forma-chair.jpg',
		alt: 'An ivory upholstered chair with a curved, button-tufted back',
		description: 'An upholstered chair with a curved back and padded seat.',
		finishes: ['Ivory']
	},
	{
		id: 'light',
		name: 'Evening light',
		category: 'lighting',
		price: 185,
		image: '/demos/forma-lamp.jpg',
		alt: 'A graphite desk lamp with an angled shade against a pale wall',
		description: 'An adjustable graphite lamp for a desk or side table.',
		finishes: ['Graphite']
	},
	{
		id: 'table',
		name: 'Everyday table',
		category: 'tables',
		price: 290,
		image: '/demos/forma-table.jpg',
		alt: 'A dark wooden side table with a lower shelf on a parquet floor',
		description: 'A wooden side table with an open lower shelf.',
		finishes: ['Dark wood']
	},
	{
		id: 'dining-chair',
		name: 'Arc dining chair',
		category: 'seating',
		price: 240,
		image: '/demos/forma-dining-chair.jpg',
		alt: 'A grey upholstered dining chair with light wooden legs',
		description: 'Grey upholstery and a curved back on a light wood frame.',
		finishes: ['Grey']
	},
	{
		id: 'sofa',
		name: 'Meadow sofa',
		category: 'seating',
		price: 1290,
		image: '/demos/forma-sofa.jpg',
		alt: 'A green velvet sofa with cylindrical cushions and wooden legs',
		description: 'A two-seat velvet sofa with removable bolster cushions.',
		finishes: ['Forest green']
	},
	{
		id: 'bedside-table',
		name: 'Round bedside table',
		category: 'tables',
		price: 165,
		image: '/demos/forma-bedside-table.jpg',
		alt: 'A round white bedside table on three white and wood legs',
		description: 'A circular white top on three tapered wooden legs.',
		finishes: ['White and wood']
	},
	{
		id: 'wood-chair',
		name: 'Workshop chair',
		category: 'seating',
		price: 195,
		image: '/demos/forma-wood-chair.jpg',
		alt: 'A warm wooden chair with a rectangular back in a pool of light',
		description: 'A simple wooden chair with a shaped back and square seat.',
		finishes: ['Warm wood']
	},
	{
		id: 'desk-lamp',
		name: 'Daylight desk lamp',
		category: 'lighting',
		price: 95,
		image: '/demos/forma-desk-lamp.jpg',
		alt: 'A white desk lamp with brass details beside a plant and wall clock',
		description: 'A white desk lamp with an adjustable shade and brass details.',
		finishes: ['White and brass']
	},
	{
		id: 'stool',
		name: 'Counter stool',
		category: 'seating',
		price: 125,
		image: '/demos/forma-stool.jpg',
		alt: 'A pale wooden counter stool with a square seat against a blue wall',
		description: 'A pale wood stool with a built-in footrest and carry handle.',
		finishes: ['Pale wood']
	},
	{
		id: 'plywood-chair',
		name: 'Leaf lounge chair',
		category: 'seating',
		price: 540,
		image: '/demos/forma-plywood-chair.jpg',
		alt: 'A sculpted plywood lounge chair with white cushions beside a palm',
		description: 'A sculpted wood frame with white upholstered cushions.',
		finishes: ['White and wood']
	},
	{
		id: 'coffee-table',
		name: 'Circle coffee table',
		category: 'tables',
		price: 360,
		image: '/demos/forma-coffee-table.jpg',
		alt: 'A round wooden coffee table in front of a cream sectional sofa',
		description: 'A round coffee table with a matching circular lower shelf.',
		finishes: ['Natural wood']
	},
	{
		id: 'shell-chair',
		name: 'Shell dining chair',
		category: 'seating',
		price: 155,
		image: '/demos/forma-shell-chair.jpg',
		alt: 'A white moulded shell chair with wooden legs beside a small table',
		description: 'A moulded white seat on wooden legs with black cross braces.',
		finishes: ['White']
	}
];
export const money = (value: number) =>
	new Intl.NumberFormat('en-IE', {
		style: 'currency',
		currency: 'EUR',
		maximumFractionDigits: 0
	}).format(value);
