import type { Snippet } from 'svelte';
import type { HTMLDialogAttributes } from 'svelte/elements';
import type { ButtonProps, IconProps, Size, StatusColor } from '../types.js';

export interface DialogHeaderProps {
	title: string;
	description?: string;
	icon?: Omit<IconProps, 'label' | 'size' | 'color'>;
}

type DialogActionProps = Pick<ButtonProps, 'label' | 'icon' | 'onClick' | 'disabled' | 'color'> & {
	color?: StatusColor;
};

export type DialogProps = Omit<
	HTMLDialogAttributes,
	'open' | 'children' | 'aria-labelledby' | 'aria-describedby'
> & {
	open?: boolean;
	header: DialogHeaderProps;
	children?: Snippet;
	footer?: Snippet | { primary: DialogActionProps; secondary: DialogActionProps };
	dismissible?: boolean;
	size?: Size | 'full-screen';
};
