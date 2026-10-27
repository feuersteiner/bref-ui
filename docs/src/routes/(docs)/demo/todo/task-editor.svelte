<script lang="ts">
	import { tick } from 'svelte';
	import { Button, Dialog, Select, TextInput } from 'bref-ui';
	import { initialPeople, type Task, type Project } from './tasks.js';
	let {
		open = $bindable(false),
		task = $bindable(),
		projects,
		onSave,
		onClose
	}: {
		open?: boolean;
		task: Task;
		projects: Project[];
		onSave: (task: Task) => void;
		onClose: () => void;
	} = $props();
	const save = (event: SubmitEvent) => {
		event.preventDefault();
		onSave({ ...task, title: task.title.trim() });
		open = false;
	};
	let people = $state([...initialPeople]);
	let adding = $state(false);
	let personName = $state('');
	let personError = $state('');
	const focus = async (id: string) => {
		await tick();
		document.getElementById(id)?.focus();
	};
	const resetPerson = () => {
		adding = false;
		personName = '';
		personError = '';
	};
	const toggleAdding = () => {
		if (adding) resetPerson();
		else {
			adding = true;
			focus('task-person-name');
		}
	};
	const addPerson = () => {
		const name = personName.trim();
		if (!name) personError = 'Enter a name.';
		else if (people.some((person) => person.toLowerCase() === name.toLowerCase()))
			personError = `${name} is already on the list.`;
		else {
			people.push(name);
			task.assignee = name;
			resetPerson();
			focus('task-assignee');
			return;
		}
		focus('task-person-name');
	};
	const personKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			addPerson();
		} else if (event.key === 'Escape') {
			event.preventDefault();
			event.stopPropagation();
			resetPerson();
			focus('task-add-person');
		}
	};
	$effect(() => {
		if (!open) resetPerson();
	});
</script>

<Dialog
	bind:open
	header={{
		title: task.id ? 'Edit task' : 'New task',
		icon: { name: task.id ? 'edit' : 'add_task' }
	}}
	size="small"
	onclose={onClose}
>
	<form data-form onsubmit={save}>
		<label for="task-title">
			Task name<TextInput id="task-title" bind:value={task.title} required pattern=".*\S.*" wide />
		</label>
		<label for="task-project">
			Project<Select id="task-project" bind:value={task.project} items={projects} />
		</label>
		<div data-field>
			<label for="task-assignee">Assignee</label>
			<div data-row>
				<Select
					id="task-assignee"
					bind:value={task.assignee}
					items={people.map((name) => ({
						id: name,
						label: name,
						icon: { name: 'person' as const }
					}))}
				/><Button
					id="task-add-person"
					icon={{ name: adding ? 'close' : 'person_add' }}
					aria-label={adding ? 'Cancel adding person' : 'Add person'}
					aria-expanded={adding}
					aria-controls="task-person"
					glass
					onClick={toggleAdding}
				/>
			</div>
			{#if adding}
				<div id="task-person" data-row>
					<TextInput
						id="task-person-name"
						bind:value={personName}
						aria-label="New person name"
						placeholder="New person"
						maxlength={40}
						autocomplete="off"
						aria-invalid={!!personError}
						aria-describedby={personError ? 'task-person-error' : undefined}
						onChange={() => (personError = '')}
						onkeydown={personKeydown}
						wide
					/><Button label="Add" icon={{ name: 'add' }} glass onClick={addPerson} />
				</div>
				{#if personError}<p id="task-person-error" role="alert">{personError}</p>{/if}
			{/if}
		</div>
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

<style>
	label,
	[data-field] {
		display: grid;
		gap: 8px;
	}
	[data-row] {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: 8px;
	}
	p {
		margin: 0;
		line-height: 1.7;
	}
	[data-actions] {
		display: flex;
		align-items: center;
		gap: 12px;
		flex-wrap: wrap;
	}
	[data-form] {
		display: grid;
		gap: 20px;
	}
	@media (prefers-reduced-motion: reduce) {
		* {
			transition-duration: 0ms;
		}
	}
</style>
