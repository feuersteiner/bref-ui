import type { IBaseSectionProps, ILinkProps, IMediaProps } from '$lib/shared/types.js';

export interface IBrandItemProps {
	logo: Omit<IMediaProps, 'type'>;
	link: Omit<ILinkProps, 'label'>;
}

export interface IBrandsProps extends IBaseSectionProps {
	items: IBrandItemProps[];
}
