<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { navigation } from './navigation.js';
	import type { PageSection } from './navigation.js';
	import Toc from './toc.svelte';

	let { sections }: { sections: readonly PageSection[] } = $props();
</script>

<aside>
	<nav aria-label="Documentation">
		{#each navigation as group (group.title)}
			<section aria-label={group.title}>
				<h2>{group.title}</h2>
				<ul>
					{#each group.links as link (link.href)}
						<li>
							<a
								href={resolve(link.href)}
								aria-current={page.url.pathname === resolve(link.href) ? 'page' : undefined}
							>
								{link.title}
							</a>
						</li>
					{/each}
				</ul>
			</section>
		{/each}
	</nav>
	{#if sections.length}<Toc {sections} />{/if}
</aside>
