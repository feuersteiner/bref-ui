import type { HTMLButtonAttributes } from 'svelte/elements';
import type { Color, Size, Variant } from '../types.js';
import type { IconProps } from '../icon/types.js';

type ButtonIconProps = Exclude<IconProps, 'label' | 'size' | 'color'>;

interface TextButtonProps {
	rounded?: never;
	label: string;
	wide?: boolean;
	icon?: ButtonIconProps;
	trailingIcon?: ButtonIconProps;
}

interface IconButtonProps {
	rounded?: boolean;
	label?: never;
	wide?: never;
	icon: ButtonIconProps;
	trailingIcon?: never;
}

interface HrefButtonProps {
	href: string;
	onClick?: never;
}

interface ClickButtonProps {
	href?: never;
	onClick: (event: MouseEvent) => void;
}

export type ButtonProps = {
	color?: Exclude<Color, 'background'>;
	size?: Size;
	variant?: Variant;
	stylesOverride?: HTMLButtonAttributes;
	disabled?: boolean;
} & (TextButtonProps | IconButtonProps) &
	(HrefButtonProps | ClickButtonProps);
