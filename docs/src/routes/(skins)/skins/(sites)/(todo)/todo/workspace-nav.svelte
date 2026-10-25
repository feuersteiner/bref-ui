<script lang="ts">
	import { Button, Icon, Select } from 'bref-ui';
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
	<a data-brand href="#demo-content"><Icon name="checklist" />Todo</a>
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

<style>
	a {
		color: inherit;
	}
	label {
		display: grid;
		gap: 8px;
	}
	[data-visually-hidden] {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
		border: 0;
	}
	a:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 4px;
	}
	[data-workspace-nav] {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		min-height: 100px;
	}
	[data-brand] {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 24px;
		font-weight: 550;
		letter-spacing: -0.04em;
		text-decoration: none;
	}
	[data-workspace-nav] nav {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	[data-workspace-nav] nav label {
		width: 230px;
	}
	[data-team] {
		display: flex;
		gap: 6px;
	}
	[data-avatar] {
		display: inline-grid;
		place-items: center;
		flex-shrink: 0;
		width: 30px;
		height: 30px;
		border-radius: 50%;
		background: #e4eaf3;
		color: var(--color-foreground);
		font-size: 10px;
	}
	@media (max-width: 1100px) {
		[data-team] {
			display: none;
		}
	}
	@media (max-width: 650px) {
		[data-workspace-nav] {
			align-items: start;
			flex-direction: column;
			gap: 16px;
			padding-block: 24px;
		}

		[data-workspace-nav] nav {
			width: 100%;
		}

		[data-workspace-nav] nav label {
			min-width: 0;
			flex: 1;
		}

		[data-avatar] {
			width: 24px;
			height: 24px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		* {
			transition-duration: 0ms;
		}
	}
</style>
