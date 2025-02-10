import type { IBaseSectionProps } from '$lib/shared/types.js';

export interface IFaqPairProps {
	question: string;
	answer: string;
}

export interface IFaqProps extends IBaseSectionProps {
	items: IFaqPairProps[];
}
