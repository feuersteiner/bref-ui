import type { IButtonProps, IButtonSizeProps, ITextAlignmentProps } from '../types.js';

export interface IButtonRowProps extends IButtonSizeProps, Partial<ITextAlignmentProps> {
	primaryButton?: IButtonProps;
	secondaryButton?: IButtonProps;
}
