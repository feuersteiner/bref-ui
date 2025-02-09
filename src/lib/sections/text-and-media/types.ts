import type { IBaseSectionProps, IMediaProps } from "$lib/shared/types.js";

export interface ITextAndMediaItemProps extends IBaseSectionProps {
	media: IMediaProps;
}

export interface ITextAndMediaProps extends IBaseSectionProps {
	items: ITextAndMediaItemProps[];
}
