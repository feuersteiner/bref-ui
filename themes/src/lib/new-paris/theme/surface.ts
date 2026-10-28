import type { SurfaceBaseProps } from 'bref-ui/types';

/** Compose typed surface classes; paint recipes are scoped in each owning component. */
export const surface = ({
	variant = 'neutral',
	color = 'foreground',
	shadow,
	hover,
	glass = false
}: SurfaceBaseProps = {}): string =>
	[
		'bref-surface',
		`bref-surface-${variant}`,
		`bref-surface-${color}`,
		shadow && `bref-surface-shadow-${shadow === true ? 'medium' : shadow}`,
		hover && `bref-surface-hover-${hover}`,
		glass && 'bref-glass'
	]
		.filter(Boolean)
		.join(' ');
