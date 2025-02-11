import type { IBaseSectionProps, IMediaProps } from '$lib/shared/types.js';

export interface ITestimonialItemProps {
	text: string;
	avatar?: IMediaProps;
	person: {
		name: string;
		company: string;
	};
}
export interface ITestimonialsProps extends IBaseSectionProps {
	items: ITestimonialItemProps[];
}
