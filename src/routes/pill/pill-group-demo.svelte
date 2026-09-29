<script lang="ts">
	import { PillGroup } from '$lib/index.js';
	import type { PillGroupProps } from '$lib/types.js';
	import CodeSnippet from '../components/code-snippet.svelte';

	let { size, variant, color }: Pick<PillGroupProps, 'size' | 'variant' | 'color'> = $props();
	const items = [
		{ id: 'draft', label: 'Draft' },
		{ id: 'review', label: 'In review' },
		{ id: 'long', label: 'A longer category that wraps on small screens' }
	];
</script>

<fieldset>
	<legend>PillGroup</legend>
	<PillGroup {items} aria-label="Document categories" {size} {variant} {color} />
</fieldset>
<CodeSnippet
	label="PillGroup usage code"
	source={`<script>\n  import { PillGroup } from 'bref-ui';\n  const items = [{ id: 'draft', label: 'Draft' }, { id: 'review', label: 'In review' }];\n<${'/'}script>\n\n<PillGroup {items} aria-label="Document categories" />`}
/>
<p>
	PillGroup renders a native list of inert Pills. Supply <code>items</code>
	with unique
	<code>id</code>
	and visible
	<code>label</code>
	values. It accepts the same size, color and variant, plus native list attributes and
	<code>bind:ref</code>
	. An optional
	<code>renderItem</code>
	snippet customizes each list item. Give the list an accessible name when its context does not identify
	it.
</p>
