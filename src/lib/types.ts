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
export type { PillDataProps, PillProps } from './pill/types.js';
export type { PillGroupProps } from './pill-group/types.js';
export type { PillChoiceGroupProps } from './pill-choice-group/types.js';
