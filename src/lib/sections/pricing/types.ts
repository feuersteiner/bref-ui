import type { IBaseSectionProps, ILinkProps } from '$lib/shared/types.js';

export interface IPricingItemProps {
	title: string;
	price: string;
	features: string[];
	featured?: boolean;
	ctaButton: ILinkProps;
}

export interface IPricingProps extends IBaseSectionProps {
	items: IPricingItemProps[];
}
