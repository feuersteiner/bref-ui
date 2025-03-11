import type { IButtonPairProps } from '$lib/shared/button/types.js';
import type { IBackgroundColorProps, ILinkProps, ILogoProps, SizeType } from '$lib/shared/types.js';

export interface IBreadcrumbProps {
	items: ILinkProps[];
}

interface ILogoNavigationProps {
	logo: Omit<ILogoProps, 'size'> & {
		size?: SizeType;
	};
}

export interface INavbarProps
	extends ILogoNavigationProps,
		IButtonPairProps,
		IBackgroundColorProps {
	items: ILinkProps[];
}

export interface IFooterProps extends ILogoNavigationProps, IBackgroundColorProps {
	columns: INavigationLinkColumnProps[];
	copyright: string;
	tagline: string;
}

export interface ILayoutProps {
	navbar: INavbarProps;
	footer: IFooterProps;
}

export interface INavigationLinkColumnProps {
	header: ILinkProps;
	children?: ILinkProps[];
}
