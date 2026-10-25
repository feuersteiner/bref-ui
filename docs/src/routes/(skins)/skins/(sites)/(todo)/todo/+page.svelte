<script lang="ts">
	import { tick } from 'svelte';
	import { Button, Icon, TextInput, Tabs } from 'bref-ui';
	import { fly } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import TaskBoard from './task-board.svelte';
	import ProjectStage from './project-stage.svelte';
	import WorkspaceNav from './workspace-nav.svelte';
	import TaskEditor from './task-editor.svelte';
	import ProjectEditor from './project-editor.svelte';
	import { initialTasks, initialProjects } from './tasks.js';
	import type { Task, Project } from './tasks.js';
	let tasks = $state(initialTasks.map((task) => ({ ...task })));
	let project = $state('all');
	let projects = $state(initialProjects.map((item) => ({ ...item })));
	let projectOpen = $state(false);
	const selectedProject = $derived(projects.find((item) => item.id === project));
	const projectName = $derived(selectedProject?.label ?? 'All projects');
	let search = $state('');
	let status = $state('all');
	const statuses = [
		{ id: 'all', label: 'All tasks', icon: 'checklist' },
		{ id: 'open', label: 'Open', icon: 'pending' },
		{ id: 'completed', label: 'Completed', icon: 'check_circle' }
	] as const;
	let editorOpen = $state(false);
	let draft = $state<Task>({
		id: 0,
		title: 'New task',
		project: 'website',
		assignee: 'Maya',
		priority: 'medium',
		done: false
	});
	let announcement = $state('');
	let workspace = $state<HTMLElement>();
	const restoreEditorFocus = async () => {
		await tick();
		if (document.activeElement === document.body)
			workspace?.querySelector<HTMLButtonElement>('[data-new-task]')?.focus();
	};
	const projectTasks = $derived(
		tasks.filter((task) => project === 'all' || task.project === project)
	);
	const completed = $derived(projectTasks.filter((task) => task.done).length);

	const filtered = $derived(
		projectTasks.filter(
			(task) =>
				task.title.toLowerCase().includes(search.toLowerCase()) &&
				(status === 'all' || task.done === (status === 'completed'))
		)
	);
	const ordered = $derived(filtered.toSorted((a, b) => Number(a.done) - Number(b.done)));
	const edit = (task?: Task) => {
		draft = task
			? { ...task }
			: {
					id: 0,
					title: 'New task',
					project: project === 'all' ? projects[0].id : project,
					assignee: 'Maya',
					priority: 'medium',
					done: false
				};
		editorOpen = true;
	};
	const save = (task: Task) => {
		if (task.id) tasks = tasks.map((item) => (item.id === task.id ? task : item));
		else tasks = [...tasks, { ...task, id: Math.max(...tasks.map((item) => item.id), 0) + 1 }];
		announcement = task.id ? 'Task updated.' : 'Task created.';
	};
	const toggle = (id: number) => {
		tasks = tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task));
	};
	const createProject = (draft: Omit<Project, 'id'>) => {
		const name = draft.label.trim();
		if (!name) return 'Choose a name for this project.';
		if (name.toLowerCase() === 'all') return 'Choose a name for this project.';
		if (projects.some((item) => item.label.toLowerCase() === name.toLowerCase()))
			return 'A project with this name already exists.';
		project = `project-${Date.now()}`;
		projects = [...projects, { ...draft, id: project, label: name }];
		announcement = 'Project created.';
		return '';
	};
</script>

<svelte:head>
	<title>Todo — a Bref task workspace demo</title>
	<meta
		name="description"
		content="Todo is a task workspace for projects and tasks, built with Bref. Filter, finish and edit the work in front of you."
	/>
</svelte:head>
<div data-workspace>
	<WorkspaceNav {projects} bind:project onCreate={() => (projectOpen = true)} />
	<main id="demo-content" tabindex="-1" bind:this={workspace}>
		{#key project}
			<div
				in:fly={{
					y: prefersReducedMotion.current ? 0 : 12,
					duration: prefersReducedMotion.current ? 0 : 240
				}}
			>
				<ProjectStage
					{project}
					photo={selectedProject?.photo ?? 'studio'}
					{projectName}
					{completed}
					total={projectTasks.length}
				/>
			</div>
		{/key}
		<section
			data-tasks
			aria-labelledby="work-heading"
			in:fly={{
				y: prefersReducedMotion.current ? 0 : 10,
				duration: prefersReducedMotion.current ? 0 : 240,
				delay: prefersReducedMotion.current ? 0 : 60
			}}
		>
			<div data-toolbar>
				<h2 id="work-heading"><Icon name="checklist" />Tasks</h2>
				<div data-task-actions>
					<div data-task-search>
						<TextInput
							aria-label="Search tasks"
							placeholder="Find a task"
							icon={{ name: 'search' }}
							bind:value={search}
							size="small"
						/>
					</div>
					<span data-new-task-action>
						<Button
							label="New task"
							data-new-task
							size="small"
							icon={{ name: 'add' }}
							variant="filled"
							color="primary"
							onClick={() => edit()}
						/>
					</span>
				</div>
			</div>
			<div data-task-tabs>
				<Tabs items={statuses} bind:value={status} label="Task status" size="small" />
			</div>
			<div
				id="task-status-panel"
				role="tabpanel"
				aria-label={statuses.find((item) => item.id === status)?.label}
				tabindex="0"
			>
				<TaskBoard {projects} tasks={ordered} onEdit={edit} onToggle={toggle} />
			</div>
			<footer data-work-footer>
				<span>Demo changes reset when you leave.</span>
			</footer>
		</section>
		<p role="status" data-announcement>{announcement}</p>
	</main>
</div>
<TaskEditor
	{projects}
	bind:open={editorOpen}
	bind:task={draft}
	onSave={save}
	onClose={restoreEditorFocus}
/>
{#if projectOpen}<ProjectEditor
		bind:open={projectOpen}
		existingNames={projects.map((item) => item.label)}
		onSave={createProject}
	/>{/if}

<style>
	[data-task-tabs] {
		min-width: 0;
		margin-bottom: 20px;
	}
	h2 {
		font-weight: 500;
		line-height: 1.15;
	}
	main {
		min-width: 0;
	}
	p {
		line-height: 1.7;
	}
	[data-workspace] {
		max-width: 1380px;
		margin: auto;
		padding: 0 48px;
	}
	[data-tasks] {
		padding-top: 36px;
	}
	[data-toolbar] {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
	}
	[data-task-actions] {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
	}
	[data-toolbar] {
		padding-bottom: 20px;
	}
	[data-toolbar] h2 {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 18px;
	}
	[data-work-footer] {
		padding: 18px 0;
		color: var(--color-muted);
		font-size: 11px;
	}
	[data-announcement] {
		min-height: 24px;
		color: var(--color-primary);
		font-size: 12px;
		padding-bottom: 24px;
	}
	@media (max-width: 1100px) {
		[data-workspace] {
			padding-inline: 28px;
		}
	}
	@media (max-width: 650px) {
		[data-workspace] {
			padding-inline: 20px;
		}

		[data-toolbar] {
			align-items: center;
			flex-direction: row;
			flex-wrap: wrap;
			gap: 16px;
		}

		[data-task-actions] {
			width: 100%;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		* {
			transition-duration: 0ms;
		}
	}
	[data-task-search] {
		width: min(360px, 42vw);
		min-width: 0;
	}
	[data-new-task-action] {
		flex-shrink: 0;
		white-space: nowrap;
	}
	@media (max-width: 650px) {
		[data-task-search] {
			flex: 1;
			width: auto;
		}
	}
</style>
