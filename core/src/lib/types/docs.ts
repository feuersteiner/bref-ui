/* eslint-disable @typescript-eslint/consistent-type-definitions -- Preserve the agreed documentation type aliases. */
export type FieldDocProps = {
	name: string;
	type: string;
	description: string;
	required?: boolean | string;
	default?: string;
	bindable?: boolean;
};

export type ComponentDocProps = {
	description: string;
	usage: string;
	props: FieldDocProps[];
};
