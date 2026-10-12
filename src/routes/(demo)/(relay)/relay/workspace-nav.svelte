<script lang="ts">
	import { Button, Icon, Select } from '$lib/index.js';
	import { fly } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import type { Project } from './tasks.js';
	let {
		project = $bindable('all'),
		projects,
		onCreate
	}: {
		project?: string;
		projects: Project[];
		onCreate: () => void;
	} = $props();
</script>

<header
	data-workspace-nav
	in:fly={{
		y: prefersReducedMotion.current ? 0 : 6,
		duration: prefersReducedMotion.current ? 0 : 180
	}}
>
	<a data-brand href="#demo-content"><Icon name="layers" />Relay</a>
	<nav aria-label="Project filter">
		<label for="project-selector">
			<span data-visually-hidden>Project</span>
			<Select
				id="project-selector"
				items={[{ id: 'all', label: 'All', icon: { name: 'layers' } }, ...projects]}
				bind:value={() => project, (value) => (project = String(value))}
				size="small"
			/>
		</label>
		<Button
			icon={{ name: 'add', label: 'New project' }}
			rounded
			glass
			size="small"
			onClick={onCreate}
		/>
	</nav>
	<div data-team role="group" aria-label="Studio collaborators">
		<span data-avatar role="img" aria-label="Maya Chen">MC</span>
		<span data-avatar role="img" aria-label="Alex Rivera">AR</span>
		<span data-avatar role="img" aria-label="Sam Taylor">ST</span>
	</div>
</header>
