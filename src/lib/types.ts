export type BaseSize = 'small' | 'medium' | 'large';
export type Size = 'x-small' | BaseSize | 'x-large';
export type Variant = 'neutral' | 'soft' | 'filled';
export type StatusColor = 'info' | 'success' | 'warning' | 'error';
export type Color = 'primary' | 'secondary' | 'foreground' | 'background' | 'muted' | StatusColor;
export type Orientation = 'horizontal' | 'vertical';
export type Dimension = 'fit' | 'fill';

export type { ButtonProps } from './button/types.js';
export type * from './icon/types.js';
export type { SurfaceProps, SurfaceRadius } from './surface/types.js';
export type * from './theme/types.ts';
export type { CheckboxProps } from './checkbox/types.js';
export type { SwitchProps } from './switch/types.js';
export type { ProgressProps } from './progress/types.js';
export type { SpinnerProps } from './spinner/types.js';
export type {
	DialogActionProps,
	DialogHeaderDataProps,
	DialogHeaderProps,
	DialogProps
} from './dialog/types.js';
export type { TextInputProps } from './text-input/types.js';
export type { TextAreaProps } from './text-area/types.js';
export type * from './tree-view/types.js';
