import type { IconName } from '$lib/icon/types.js';

export interface AuditRun {
	id: number;
	url: string;
	status: 'running' | 'ready' | 'stopped';
	step: number;
	reviewed: string[];
}
export const steps = [
	{ title: 'Read the sample page', icon: 'travel_explore' as const },
	{ title: 'Check the buying flow', icon: 'shopping_cart' as const },
	{ title: 'Prepare suggestions', icon: 'checklist' as const }
];
export const findings: {
	id: string;
	title: string;
	area: string;
	icon: IconName;
	evidence: string;
	action: string;
}[] = [
	{
		id: 'dimensions',
		title: 'Put dimensions beside the price',
		area: 'Product details',
		icon: 'straighten',
		evidence:
			'The sample chair page describes its fabric and finish, but leaves its dimensions below the product description.',
		action:
			'Move width, depth and height beside the price so a shopper can check the fit before adding it to their cart.'
	},
	{
		id: 'delivery',
		title: 'Show delivery before checkout',
		area: 'Checkout',
		icon: 'local_shipping',
		evidence:
			'The sample cart shows a subtotal without a delivery estimate or a link to shipping information.',
		action: 'Add the expected delivery window and a short shipping note beneath the subtotal.'
	},
	{
		id: 'navigation',
		title: 'Keep the collection one click away',
		area: 'Navigation',
		icon: 'explore',
		evidence:
			'The sample product detail view has a close control, but no visible route back to the full collection.',
		action: 'Add a clearly named Back to collection link to the product detail view.'
	}
];
export const exampleRun: AuditRun = {
	id: 1,
	url: 'https://forma.example',
	status: 'ready',
	step: 3,
	reviewed: []
};
export const siteName = (url: string) => {
	try {
		return new URL(url).hostname;
	} catch {
		return url;
	}
};
