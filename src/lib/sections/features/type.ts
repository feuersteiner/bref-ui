import type {
	IBaseSectionProps,
	IGridSizeProps,
	IMediaProps,
	ISubtitleProps,
	ITitleProps
} from '$lib/shared/types.js';

export interface IFeatureSectionItemProps extends ITitleProps, ISubtitleProps{
	media: IMediaProps;
}

export interface IFeatureSectionProps extends IBaseSectionProps, IGridSizeProps  {
	items: IFeatureSectionItemProps[];
}
