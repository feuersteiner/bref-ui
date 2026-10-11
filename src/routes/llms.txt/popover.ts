export default {
	props:
		"trigger: Snippet; children: Snippet; open?: boolean = false; disabled?: boolean = false; as?: 'div' | 'section' | 'span' = div; variant?: Variant = soft; color?: Color = background; shadow?: BaseSize | boolean = medium; hover?: BaseSize; spacing?: Size = medium; orientation?: Orientation = vertical; width?: Dimension; height?: Dimension; radius?: SurfaceRadius = small; scroll?: boolean = false; class?: string; style?: string",
	purpose: 'Show content anchored to a trigger.',
	setup: 'let open = $state(false);',
	example:
		'<Popover bind:open>\n  {#snippet trigger()}\n    <button onclick={() => open = !open} aria-expanded={open}>Details</button>\n  {/snippet}\n  Content\n</Popover>'
};
