import type { IButtonProps, ILinkProps, ILogoProps } from '$lib/shared/types.js';

export interface IBreadcrumbProps {
	items: ILinkProps[];
}

export interface INavbarProps {
	items: ILinkProps[];
	primaryCta?: IButtonProps;
	secondaryCta?: IButtonProps;
	logo: Omit<ILogoProps, 'size'>;
}

export interface IFooterProps {
	columns: INavigationLinkColumnProps[];
}

export interface ILayoutProps {
	navbar: INavbarProps;
	footer: IFooterProps;
}

export interface INavigationLinkColumnProps {
	header: ILinkProps;
	children?: ILinkProps[];
}
