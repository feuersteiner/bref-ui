export interface IJsonLdPageProps {
	additionalType: string;
	name: string;
	legalName: string;
	logo: string;
	socialMedia: string[];
}

export interface IPageSeoProps {
	title: string;
	description: string;
	thumbnail: string;
	keywords: string[];
	path: string;
	baseUrl: string;
	jsonLd: IJsonLdPageProps;
}
