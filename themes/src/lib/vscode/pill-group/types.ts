import type { HTMLAttributes } from 'svelte/elements';
import type { PillDataProps, PillGroupProps } from 'bref-ui/types';
import type { Snippet } from 'svelte';

export type PillGroupContainerProps = Omit<HTMLAttributes<HTMLUListElement>, 'children'> &
	Pick<PillGroupProps, 'items' | 'size'> & {
		renderItem: Snippet<[PillDataProps]>;
	};
