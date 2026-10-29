import type { SurfaceBaseProps } from '../types.js';

/** Compose typed surface classes; render Theme once to load their paint recipes. */
export const surface = ({
	variant = 'neutral',
	color = 'foreground',
	shadow,
	hover,
	glass = false
}: SurfaceBaseProps = {}): string =>
	[
		'surface',
		`surface-${variant}`,
		`surface-${color}`,
		shadow && `surface-shadow-${shadow === true ? 'medium' : shadow}`,
		hover && `surface-hover-${hover}`,
		glass && 'glass'
	]
		.filter(Boolean)
		.join(' ');
