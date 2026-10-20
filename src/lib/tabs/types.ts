import type { IconName, Orientation } from '../types.ts';

/** Data for a tab in the strip. */
export interface TabItemDataProps {
	/** Unique tab ID used for selection. */
	id: string;
	/** Visible tab text and accessible name. */
	label: string;
	/** Material Symbols icon displayed beside the label. */
	icon: IconName;
	/** Prevent selection of this tab. */
	disabled?: boolean;
}

/** Props for a rendered tab item, including its selection state. */
export interface TabItemProps extends TabItemDataProps {
	/** Whether this item is selected, derived from the strip's value. */
	selected?: boolean;
}

/** A horizontal or vertical tab strip; the consumer owns the content. */
export interface TabsProps {
	/** Tabs in display order. */
	items: readonly TabItemDataProps[];
	/** Direction of the tab strip. */
	orientation?: Orientation;
	/** ID of the selected tab. */
	value?: string;
	/** Called with the tab ID when user interaction changes selection. */
	onChange?: (id: string) => void;
	/** Accessible name for the tab list. */
	label?: string;
	/** Use filled glyphs for all tab icons. */
	filled?: boolean;
	/** Apply translucent styling and backdrop blur to the tab strip. */
	glass?: boolean;
}
