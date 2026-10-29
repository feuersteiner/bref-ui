import type { DOMAttributes, HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
import type { Color, Size, Variant } from '../types.js';
import type { IconProps } from '../icon/types.js';

type ButtonIconProps = Omit<IconProps, 'size' | 'color'>;

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

type HrefButtonProps = Omit<
	HTMLAnchorAttributes,
	keyof DOMAttributes<HTMLElement> | 'color' | 'href'
> & {
	href: string;
};

type ClickButtonProps = Omit<HTMLButtonAttributes, keyof DOMAttributes<HTMLElement> | 'color'> & {
	href?: never;
};

export type ButtonProps = {
	color?: Exclude<Color, 'background'>;
	size?: Size;
	variant?: Variant;
	glass?: boolean;
	disabled?: boolean;
	onClick?: DOMAttributes<HTMLButtonElement | HTMLAnchorElement>['onclick'];
} & Omit<DOMAttributes<HTMLButtonElement | HTMLAnchorElement>, 'children' | 'onclick'> &
	(TextButtonProps | IconButtonProps) &
	(HrefButtonProps | ClickButtonProps);
