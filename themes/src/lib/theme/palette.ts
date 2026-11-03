import type { Color, ThemeProps } from 'bref-ui/types';

const roles: Color[] = [
	'primary',
	'secondary',
	'background',
	'foreground',
	'muted',
	'info',
	'success',
	'warning',
	'error'
];

/** Only supplied colors become inline declarations; scoped CSS supplies the defaults. */
export const paletteStyle = (palette: ThemeProps['palette'] = {}): string => {
	const modes = 'light' in palette ? palette : { light: palette, dark: palette };
	return (['light', 'dark'] as const)
		.flatMap((mode) =>
			roles.flatMap((role) => {
				const value = modes[mode][role];
				if (value === undefined) return [];
				if (!/^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(value))
					throw new Error(`Theme palette ${mode}.${role} must be a hex color.`);
				return `--color-${role}-${mode}: ${value};`;
			})
		)
		.join(' ');
};
