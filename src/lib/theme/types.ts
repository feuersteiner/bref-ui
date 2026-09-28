export type ThemeMode = 'light' | 'dark' | 'auto';

export interface ThemeModeToggleProps {
	/** Initial or bound theme mode; auto follows the system preference. */
	mode?: ThemeMode;
}
