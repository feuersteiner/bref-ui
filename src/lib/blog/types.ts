import type {
	IBaseSectionProps,
	IMediaProps,
	ISubtitleProps,
	ITitleProps
} from '$lib/shared/types.js';

export interface IBaseBlogPostProps extends ITitleProps, ISubtitleProps {
	thumbnail: Omit<IMediaProps, 'type'>;
	href: string;
	datePublished: Date;
}
export interface IBlogListingProps
	extends Omit<IBaseSectionProps, 'primaryButton' | 'secondaryButton'> {
	posts: IBaseBlogPostProps[];
}

export interface IBlogPostProps extends IBaseBlogPostProps {
	content: string;
	keywords: string[];
}
