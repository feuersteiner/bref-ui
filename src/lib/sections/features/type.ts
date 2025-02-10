import type {
	IBaseSectionProps,
	IGridSizeProps,
	IMediaProps,
	ISubtitleProps,
	ITitleProps
} from '$lib/shared/types.js';

interface IFeatureItemProps extends ITitleProps, ISubtitleProps {
	media: IMediaProps;
}

export interface IFeaturesProps extends IBaseSectionProps, IGridSizeProps {
	items: IFeatureItemProps[];
}
