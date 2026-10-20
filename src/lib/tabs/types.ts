import type { Dimension, IconName } from '../types.ts';
import type { TransitionConfig } from 'svelte/transition';

/** An indicator transition, including deferred Svelte transition configurations. */
export type TabTransition = (node: HTMLElement) => TransitionConfig | (() => TransitionConfig);

/** Data for a tab in the strip. */
export interface TabItemDataProps {
	/** Unique tab ID used for selection. */
	id: string;
	/** Accessible name and tab text; small screens show only the selected horizontal label. */
	label: string;
	/** Material Symbols icon displayed beside the label. */
	icon: IconName;
	/** Prevent selection of this tab. */
	disabled?: boolean;
}

/** Props for a rendered tab item, including its selection state. */
export type TabItemProps = TabItemDataProps & {
	/** Whether this item is selected, derived from the strip's value. */
	selected?: boolean;
	/** Use filled glyphs for all tab icons. */
	filled?: boolean;
	/** Select this item when activated. */
	onSelect: () => void;
	/** Animate the selected indicator into this item. */
	transitionIn?: TabTransition;
	/** Animate the selected indicator out of this item. */
	transitionOut?: TabTransition;
} & OrientationProps;

type OrientationProps =
	| {
			orientation?: 'horizontal';
			/** Fit content and scroll on overflow, or fill the parent and truncate labels. */
			size?: Dimension;
	  }
	| {
			orientation: 'vertical';
			size?: never;
	  };

/** A horizontal or vertical tab strip; the consumer owns the content. */
export type TabsProps = {
	/** Tabs in display order. */
	items: readonly TabItemDataProps[];
	/** ID of the selected tab. */
	value?: string;
	/** Called with the tab ID when user interaction changes selection. */
	onChange?: (id: string) => void;
	/** Accessible name for the tab list. */
	label?: string;
} & OrientationProps &
	Pick<TabItemProps, 'filled' | 'transitionIn' | 'transitionOut'>;
