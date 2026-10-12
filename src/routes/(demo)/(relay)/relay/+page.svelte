<script lang="ts">
	import { Button, Icon, TextInput } from '$lib/index.js';
	import { fly } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import TaskBoard from './task-board.svelte';
	import ProjectStage from './project-stage.svelte';
	import WorkspaceNav from './workspace-nav.svelte';
	import TaskEditor from './task-editor.svelte';
	import ProjectEditor from './project-editor.svelte';
	import { initialTasks, initialProjects } from './tasks.js';
	import type { Task } from './tasks.js';
	let tasks = $state(initialTasks.map((task) => ({ ...task })));
	let project = $state('all');
	let projects = $state(initialProjects.map((item) => ({ ...item })));
	let projectOpen = $state(false);
	const selectedProject = $derived(projects.find((item) => item.id === project));
	const projectName = $derived(selectedProject?.label ?? 'All projects');
	let search = $state('');
	let editorOpen = $state(false);
	let draft = $state<Task>({
		id: 0,
		title: '',
		project: 'website',
		assignee: 'Maya',
		priority: 'medium',
		done: false
	});
	let announcement = $state('');
	const projectTasks = $derived(
		tasks.filter((task) => project === 'all' || task.project === project)
	);
	const completed = $derived(projectTasks.filter((task) => task.done).length);

	const filtered = $derived(
		projectTasks.filter((task) => task.title.toLowerCase().includes(search.toLowerCase()))
	);
	const ordered = $derived(filtered.toSorted((a, b) => Number(a.done) - Number(b.done)));
	const edit = (task?: Task) => {
		draft = task
			? { ...task }
			: {
					id: 0,
					title: '',
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
	const createProject = (name: string) => {
		if (name.toLowerCase() === 'all') return 'Choose a name for this project.';
		if (projects.some((item) => item.label.toLowerCase() === name.toLowerCase()))
			return 'A project with this name already exists.';
		project = `project-${Date.now()}`;
		projects = [
			...projects,
			{ id: project, label: name, icon: { name: 'folder' }, photo: 'studio' }
		];
		announcement = 'Project created.';
		return '';
	};
</script>

<svelte:head>
	<title>Relay | a Bref workspace demo</title>
	<meta
		name="description"
		content="A creative project workspace built with Bref. Filter, finish and edit the work in front of you."
	/>
</svelte:head>
<div data-workspace>
	<WorkspaceNav {projects} bind:project onCreate={() => (projectOpen = true)} />
	<main id="demo-content" tabindex="-1">
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
					<TextInput
						aria-label="Search tasks"
						placeholder="Find a task"
						icon={{ name: 'search' }}
						bind:value={search}
						size="small"
					/><Button
						label="New task"
						size="small"
						icon={{ name: 'add' }}
						variant="filled"
						color="primary"
						onClick={() => edit()}
					/>
				</div>
			</div>
			<TaskBoard {projects} tasks={ordered} onEdit={edit} onToggle={toggle} />
			<footer data-work-footer>
				<span>Demo changes reset when you leave.</span>
			</footer>
		</section>
		<p role="status" data-announcement>{announcement}</p>
	</main>
</div>
<TaskEditor {projects} bind:open={editorOpen} bind:task={draft} onSave={save} />
{#if projectOpen}<ProjectEditor bind:open={projectOpen} onSave={createProject} />{/if}
