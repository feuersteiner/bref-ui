import type { IBaseSectionProps } from '$lib/shared/types.js';

export interface IFaqPairProps {
	question: string;
	answer: string;
}

export interface IFaqSectionProps extends IBaseSectionProps {
	items: IFaqPairProps[];
}
