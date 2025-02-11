import type {
	IBaseSectionProps,
	IMediaProps,
	ISubtitleProps,
	ITitleProps
} from '$lib/shared/types.js';

interface IFeatureItemProps extends ITitleProps, ISubtitleProps {
	media: IMediaProps;
}

export interface IFeaturesProps extends IBaseSectionProps {
	items: IFeatureItemProps[];
}
