<script lang="ts">
	import Colors from './colors.svelte';
	import Surfaces from './surfaces.svelte';
	import Glass from './glass.svelte';
	import Fonts from './fonts.svelte';
	import Styles from './styles.svelte';
	import type { ThemeProps } from './types.js';

	let { children, palette = {} }: ThemeProps = $props();
</script>

<Colors {palette} />
<Surfaces />
<Glass />
<Fonts />
<Styles />

{@render children?.()}
