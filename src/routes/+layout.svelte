<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	beforeNavigate(({ from, to, willUnload, cancel }) => {
		if (willUnload || !from || !to) return;
		const fromDemo = from.route.id?.startsWith('/(demo)/') ?? false;
		const toDemo = to.route.id?.startsWith('/(demo)/') ?? false;
		if (fromDemo !== toDemo) {
			cancel();
			window.location.assign(to.url.href);
		}
	});
</script>

{@render children()}
