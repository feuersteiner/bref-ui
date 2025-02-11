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

export interface IBlogPostProps {
	title: string;
	subtitle: string;
	content: string;
	keywords: string[];
	thumbnail: {
		src: string;
		alt: string;
	};
	href: string;
	datePublished: Date;
	author: {
		name: string;
		type: string;
	};
	publisher: {
		name: string;
		url: string;
		logo: {
			url: string;
			width: string;
			height: string;
			name: string;
		};
		socialMedia: string[];
	};
	baseUrl: string;
}
