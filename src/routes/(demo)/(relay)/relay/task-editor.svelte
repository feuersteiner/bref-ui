<script lang="ts">
	import { Button, Dialog, Select, TextInput } from '$lib/index.js';
	import type { Task, Project } from './tasks.js';
	let {
		open = $bindable(false),
		task = $bindable(),
		projects,
		onSave
	}: { open?: boolean; task: Task; projects: Project[]; onSave: (task: Task) => void } = $props();
	const save = (event: SubmitEvent) => {
		event.preventDefault();
		onSave({ ...task, title: task.title.trim() });
		open = false;
	};
</script>

<Dialog
	bind:open
	header={{
		title: task.id ? 'Edit task' : 'New task',
		icon: { name: task.id ? 'edit' : 'add_task' }
	}}
	size="small"
>
	<form data-form onsubmit={save}>
		<label for="task-title">
			Task name<TextInput id="task-title" bind:value={task.title} required pattern=".*\S.*" wide />
		</label>
		<label for="task-project">
			Project<Select id="task-project" bind:value={task.project} items={projects} />
		</label>
		<label for="task-assignee">
			Assignee<Select
				id="task-assignee"
				bind:value={task.assignee}
				items={['Maya', 'Alex', 'Sam'].map((name) => ({
					id: name,
					label: name,
					icon: { name: 'person' as const }
				}))}
			/>
		</label>
		<label for="task-priority">
			Priority<Select
				id="task-priority"
				bind:value={task.priority}
				items={['high', 'medium', 'low'].map((id) => ({
					id,
					label: id.charAt(0).toUpperCase() + id.slice(1),
					icon: {
						name: id === 'high' ? 'priority_high' : id === 'medium' ? 'flag' : 'low_priority'
					}
				}))}
			/>
		</label>
		<div data-actions>
			<Button
				type="submit"
				label="Save task"
				icon={{ name: 'save' }}
				variant="filled"
				color="primary"
			/><Button label="Cancel" icon={{ name: 'close' }} glass onClick={() => (open = false)} />
		</div>
	</form>
</Dialog>
