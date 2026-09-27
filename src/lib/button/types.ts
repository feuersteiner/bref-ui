import type { HTMLButtonAttributes } from 'svelte/elements';
import type { Color, Size, Variant } from '../types.js';
import type { IconProps } from '../icon/types.js';

type ButtonIconProps = Exclude<IconProps, 'label' | 'size' | 'color'>;

export type ButtonProps = {
	color?: Exclude<Color, 'background'>;
	size?: Size;
	variant?: Variant;
	stylesOverride?: HTMLButtonAttributes;
} & (
	| {
			// Regular buttons with a label
			rounded?: never;
			label: string;
			wide?: boolean;
			icon?: ButtonIconProps;
			trailingIcon?: ButtonIconProps;
	  }
	| {
			// Icon buttons only
			rounded?: boolean;
			label?: never;
			wide?: never;
			icon: ButtonIconProps;
			trailingIcon?: never;
	  }
);
