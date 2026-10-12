<script lang="ts">
	import { Button, Dialog, TextInput } from '$lib/index.js';
	let { open = $bindable(false), onSave }: { open?: boolean; onSave: (name: string) => string } =
		$props();
	let name = $state('');
	let error = $state('');
	const save = (event: SubmitEvent) => {
		event.preventDefault();
		error = onSave(name.trim());
		if (!error) open = false;
	};
</script>

<Dialog
	bind:open
	header={{ title: 'New project', icon: { name: 'create_new_folder' } }}
	size="small"
>
	<form data-form onsubmit={save}>
		<label for="project-name">
			Project name
			<TextInput
				id="project-name"
				bind:value={name}
				required
				pattern=".*\S.*"
				maxlength={60}
				aria-invalid={!!error}
				aria-describedby={error ? 'project-error' : undefined}
				wide
			/>
		</label>
		{#if error}<p id="project-error" role="alert">{error}</p>{/if}
		<div data-actions>
			<Button
				type="submit"
				label="Create project"
				icon={{ name: 'add' }}
				variant="filled"
				color="primary"
			/>
			<Button label="Cancel" icon={{ name: 'close' }} onClick={() => (open = false)} />
		</div>
	</form>
</Dialog>
