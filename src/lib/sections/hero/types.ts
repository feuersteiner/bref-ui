import type { IBaseSectionProps, IMediaProps } from '$lib/shared/types.js';

export interface IMediaHeroProps extends IBaseSectionProps {
	media: IMediaProps;
	type?: 'vertical' | 'horizontal';
	mediaFirst?: boolean;
}
