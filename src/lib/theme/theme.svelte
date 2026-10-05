<script lang="ts">
	import Colors from './colors.svelte';
	import Surfaces from './surfaces.svelte';
	import Fonts from './fonts.svelte';
	import Styles from './styles.svelte';
	import type { ThemeProps } from './types.js';

	let { children, palette = {} }: ThemeProps = $props();
</script>

<Colors {palette} />
<Surfaces />
<Fonts />
<Styles />

{@render children?.()}
