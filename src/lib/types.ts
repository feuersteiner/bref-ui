export type BaseSize = 'small' | 'medium' | 'large';
export type Size = 'x-small' | BaseSize | 'x-large';
export type Variant = 'neutral' | 'soft' | 'filled';
export type StatusColor = 'info' | 'success' | 'warning' | 'error';
export type Color = 'primary' | 'secondary' | 'foreground' | 'background' | 'muted' | StatusColor;
export type Orientation = 'horizontal' | 'vertical';
export type Dimension = 'fit' | 'fill';

export type { IconName, IconProps } from './icon/types.js';
