import type { IButtonProps, ISizeProps, ITextAlignmentProps } from '../types.js';

export interface IButtonPairProps {
	primaryButton?: IButtonProps;
	secondaryButton?: IButtonProps;
}

export interface IButtonRowProps
	extends ISizeProps,
		Partial<ITextAlignmentProps>,
		IButtonPairProps {
	snug?: boolean;
}
