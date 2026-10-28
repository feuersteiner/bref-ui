<script lang="ts">
	import type { Snippet } from 'svelte';
	import Colors from './colors.svelte';
	import Surfaces from './surfaces.svelte';
	import Glass from './glass.svelte';
	import Fonts from './fonts.svelte';
	import Styles from './styles.svelte';

	let { children }: { children?: Snippet } = $props();
</script>

<Colors />
<Surfaces />
<Glass />
<Fonts />
<Styles />

{@render children?.()}
