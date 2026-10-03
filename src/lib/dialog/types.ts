import type { Snippet } from 'svelte';
import type { HTMLDialogAttributes } from 'svelte/elements';
import type { ButtonProps, IconProps, Size, StatusColor } from '../types.js';

export interface DialogHeaderDataProps {
	title: string;
	description?: string;
	icon?: Omit<IconProps, 'label' | 'size' | 'color'>;
}

export interface DialogHeaderProps extends DialogHeaderDataProps {
	id: string;
	dismissible: boolean;
	onDismiss: () => void;
}

export type DialogActionProps = Pick<
	Extract<ButtonProps, { label: string; onClick: unknown }>,
	'label' | 'icon' | 'onClick' | 'disabled'
> & {
	color?: StatusColor;
};

export type DialogProps = Omit<
	HTMLDialogAttributes,
	'open' | 'children' | 'aria-labelledby' | 'aria-describedby'
> & {
	open?: boolean;
	header: DialogHeaderDataProps;
	children: Snippet;
	footer?: Snippet | { primary: DialogActionProps; secondary: DialogActionProps };
	dismissible?: boolean;
	size?: Size | 'full-screen';
};
