<script lang="ts">
	import { Button, Pill, Checkbox } from 'bref-ui';
	import { onDestroy, tick } from 'svelte';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import { SvelteMap } from 'svelte/reactivity';
	import type { Task, Project } from './tasks.js';
	let {
		tasks,
		projects,
		onEdit,
		onToggle
	}: {
		tasks: Task[];
		projects: Project[];
		onEdit: (task: Task) => void;
		onToggle: (id: number) => void;
	} = $props();
	const firstCompleted = $derived(tasks.find((task) => task.done)?.id);
	const pending = new SvelteMap<number, { done: boolean; timer: ReturnType<typeof setTimeout> }>();
	let board: HTMLUListElement;

	async function toggle(task: Task, done: boolean, input: HTMLInputElement) {
		const previous = pending.get(task.id);
		if (previous) clearTimeout(previous.timer);
		const settle = async () => {
			pending.delete(task.id);
			const current = tasks.find((item) => item.id === task.id) ?? task;
			if (current.done === done) return;
			const hadFocus = document.activeElement === input;
			const index = tasks.findIndex((item) => item.id === task.id);
			onToggle(task.id);
			await tick();
			// Moving keyed DOM nodes can drop focus; filters can remove the row entirely.
			if (
				hadFocus &&
				(document.activeElement === input || document.activeElement === document.body)
			) {
				const next =
					tasks.find((item) => item.id === task.id) ??
					tasks[Math.min(Math.max(index, 0), tasks.length - 1)];
				const target = next
					? board.querySelector<HTMLInputElement>(`[data-task-id="${next.id}"] input`)
					: board.closest<HTMLElement>('[role="tabpanel"]');
				target?.focus({ preventScroll: true });
			}
		};
		if (prefersReducedMotion.current) await settle();
		else pending.set(task.id, { done, timer: setTimeout(settle, done ? 560 : 440) });
	}

	onDestroy(() => {
		for (const { timer } of pending.values()) clearTimeout(timer);
	});
</script>

<ul data-task-board aria-label="Project tasks" bind:this={board}>
	{#each tasks as task (task.id)}
		<li
			data-task
			data-task-id={task.id}
			data-done={pending.get(task.id)?.done ?? task.done}
			transition:fly={{
				y: prefersReducedMotion.current ? 0 : 8,
				duration: prefersReducedMotion.current ? 0 : 180
			}}
			animate:flip={{
				duration: prefersReducedMotion.current ? 0 : 560,
				easing: quintOut
			}}
		>
			{#if task.id === firstCompleted}<h3 data-completed-heading>Completed</h3>{/if}
			{#key pending.get(task.id)}
				{#if pending.get(task.id)?.done}<span data-task-wash aria-hidden="true"></span>{/if}
			{/key}
			<div data-task-completion>
				<Checkbox
					bind:checked={
						() => pending.get(task.id)?.done ?? task.done,
						(done) => {
							const input = board.querySelector<HTMLInputElement>(
								`[data-task-id="${task.id}"] input`
							);
							if (input) void toggle(task, !!done, input);
						}
					}
					aria-label={`${(pending.get(task.id)?.done ?? task.done) ? 'Reopen' : 'Complete'} ${task.title}`}
				/>
				{#key pending.get(task.id)}
					{#if pending.get(task.id)?.done}<span data-task-ripple aria-hidden="true"></span>{/if}
				{/key}
			</div>
			<div data-task-content><h3><span data-task-title>{task.title}</span></h3></div>
			<div data-task-tags>
				<Pill
					label={projects.find((item) => item.id === task.project)?.label ?? 'Project'}
					icon={projects.find((item) => item.id === task.project)?.icon ?? { name: 'folder' }}
					size="x-small"
					variant="soft"
					color={task.project === 'website' ? 'primary' : 'secondary'}
				/>
				<Pill
					label={task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
					icon={{
						name:
							task.priority === 'high'
								? 'priority_high'
								: task.priority === 'medium'
									? 'flag'
									: 'low_priority'
					}}
					size="x-small"
					variant="soft"
					color={task.priority === 'high' ? 'secondary' : 'muted'}
				/>
			</div>
			<span data-assignee>
				<span data-avatar aria-hidden="true">{task.assignee.slice(0, 1)}</span>
				{task.assignee}
			</span>
			<div data-task-edit>
				<Button
					variant="neutral"
					glass
					rounded
					size="small"
					icon={{ name: 'edit', label: `Edit ${task.title}` }}
					onClick={() => onEdit(task)}
				/>
			</div>
		</li>
	{/each}
	{#if !tasks.length}<li data-empty>No matching tasks.</li>{/if}
</ul>

<style>
	[data-task] {
		position: relative;
		isolation: isolate;
	}
	[data-task] [data-task-content] h3 {
		text-decoration: none;
		transition: color 320ms ease;
	}
	[data-task-title] {
		background: linear-gradient(currentColor, currentColor) no-repeat left 55% / 0% 1px;
		transition: background-size 320ms cubic-bezier(0.22, 1, 0.36, 1);
	}
	[data-task][data-done='true'] [data-task-content] h3 {
		text-decoration: none;
	}
	[data-done='true'] [data-task-title] {
		background-size: 100% 1px;
	}
	[data-task-wash] {
		position: absolute;
		inset: 0;
		z-index: -1;
		border-radius: inherit;
		pointer-events: none;
		background: linear-gradient(
			90deg,
			color-mix(in srgb, var(--color-primary) 12%, transparent),
			color-mix(in srgb, var(--color-primary) 4%, transparent) 60%,
			transparent
		);
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--color-primary) 22%, transparent);
		animation: complete-wash 560ms linear both;
	}
	@keyframes complete-wash {
		0% {
			clip-path: inset(0 100% 0 0);
			animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
		}
		55% {
			opacity: 1;
			clip-path: inset(0);
			animation-timing-function: ease-out;
		}
		100% {
			opacity: 0;
			clip-path: inset(0);
		}
	}
	[data-task-completion] {
		position: relative;
		display: grid;
	}
	[data-task-ripple] {
		position: absolute;
		inset: 0;
		width: 1.25rem;
		height: 1.25rem;
		margin: auto;
		border-radius: 0.25rem;
		pointer-events: none;
		background: color-mix(in srgb, var(--color-primary) 18%, transparent);
		box-shadow: 0 0 0 1.5px color-mix(in srgb, var(--color-primary) 50%, transparent);
		animation: complete-ripple 520ms cubic-bezier(0.22, 1, 0.36, 1) both;
	}
	@keyframes complete-ripple {
		from {
			opacity: 1;
			transform: scale(1);
		}
		to {
			opacity: 0;
			transform: scale(2.4);
			border-radius: 50%;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		[data-task] [data-task-content] h3,
		[data-task-title] {
			transition: none;
		}
		[data-task-wash],
		[data-task-ripple] {
			display: none;
			animation: none;
		}
	}
	h3 {
		font-weight: 500;
		line-height: 1.15;
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
	[data-task-board] {
		list-style: none;
	}
	[data-task] {
		--relay-title-row: 1;
		--relay-meta-row: 2;
		display: grid;
		/* Every row is its own grid, so tracks must not depend on row content to stay aligned. */
		grid-template-columns: 20px minmax(170px, 1fr) 16rem 80px 36px;
		align-items: center;
		gap: 18px;
		padding: 20px 22px;
		margin-bottom: 10px;
		border-radius: 18px;
		background: var(--relay-panel);
		backdrop-filter: blur(20px);
		box-shadow: 0 1px 0 #ffffffcc;
	}
	[data-task-content] {
		min-width: 0;
	}
	[data-task-content] {
		grid-row: var(--relay-title-row);
	}
	[data-task-tags] {
		grid-row: var(--relay-title-row);
	}
	[data-assignee] {
		grid-row: var(--relay-title-row);
	}
	[data-task-content] h3 {
		font:
			400 15px/1.5 'Inter Variable',
			sans-serif;
		letter-spacing: -0.02em;
		overflow-wrap: anywhere;
	}
	[data-task][data-done='true'] h3:not([data-completed-heading]) {
		color: var(--color-muted);
	}
	[data-task][data-done='true'] {
		background: #ffffff44;
	}
	[data-task-tags] {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	/* The heading sits above its row, outside the card grid, so the row keeps the shared layout. */
	[data-completed-heading] {
		position: absolute;
		bottom: 100%;
		left: 0;
		padding-bottom: 8px;
		font:
			500 12px/1.4 'Inter Variable',
			sans-serif;
		color: var(--color-muted);
		white-space: nowrap;
	}
	[data-task]:has([data-completed-heading]) {
		margin-top: 44px;
	}
	/* Nothing precedes it to separate from, as in the Completed tab, whose tab already names it. */
	[data-task]:first-child [data-completed-heading] {
		display: none;
	}
	[data-task]:first-child:has([data-completed-heading]) {
		margin-top: 0;
	}
	[data-assignee] {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 12px;
	}
	[data-empty] {
		padding: 40px 0;
		color: var(--color-muted);
	}
	@container demo (max-width: 1100px) {
		[data-task] {
			grid-template-columns: 20px minmax(0, 1fr) 80px 36px;
			gap: 12px;
		}

		[data-task-content] {
			grid-column: 2;
		}

		[data-task-tags] {
			grid-column: 2;
			grid-row: var(--relay-meta-row);
		}

		[data-assignee] {
			grid-column: 3;
			grid-row: var(--relay-title-row) / span 2;
		}
	}
	@container demo (max-width: 650px) {
		[data-task] {
			grid-template-columns: 20px minmax(0, 1fr) 32px;
			padding: 18px 16px;
			gap: 12px;
		}

		[data-task-content] {
			grid-column: 2;
		}

		[data-assignee] {
			grid-column: 2/4;
			grid-row: calc(var(--relay-meta-row) + 1);
		}

		[data-task-tags] {
			grid-column: 2/4;
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
	[data-task-completion],
	[data-task-edit] {
		grid-row: var(--relay-title-row);
	}
	@container demo (max-width: 1100px) {
		[data-task-edit] {
			grid-column: 4;
			grid-row: var(--relay-title-row) / span 2;
		}
	}
	@container demo (max-width: 650px) {
		[data-task-edit] {
			grid-column: 3;
			grid-row: var(--relay-title-row);
		}
	}
</style>
