<script lang="ts">
	import { Button, Checkbox, Pill } from '$lib/index.js';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
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
</script>

<ul data-task-board aria-label="Project tasks">
	{#each tasks as task (task.id)}
		<li
			data-task
			data-done={task.done}
			transition:fly={{
				y: prefersReducedMotion.current ? 0 : 8,
				duration: prefersReducedMotion.current ? 0 : 180
			}}
			animate:flip={{
				duration: prefersReducedMotion.current ? 0 : 320
			}}
		>
			{#if task.id === firstCompleted}<h3 data-completed-heading>Completed</h3>{/if}
			<Checkbox
				checked={task.done}
				onchange={() => onToggle(task.id)}
				aria-label={`Complete ${task.title}`}
			/>
			<div data-task-content><h3>{task.title}</h3></div>
			<div data-task-tags>
				<Pill
					label={projects.find((item) => item.id === task.project)?.label ?? 'Project'}
					icon={projects.find((item) => item.id === task.project)?.icon ?? { name: 'folder' }}
					size="small"
					variant="soft"
					color={task.project === 'website' ? 'primary' : 'secondary'}
					glass
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
					size="small"
					variant="neutral"
					color={task.priority === 'high' ? 'secondary' : 'muted'}
					glass
				/>
			</div>
			<span data-assignee>
				<span data-avatar aria-hidden="true">{task.assignee.slice(0, 1)}</span>
				{task.assignee}
			</span>
			<Button
				variant="neutral"
				glass
				rounded
				size="small"
				icon={{ name: 'edit', label: `Edit ${task.title}` }}
				onClick={() => onEdit(task)}
			/>
		</li>
	{/each}
	{#if !tasks.length}<li data-empty>No matching tasks.</li>{/if}
</ul>
