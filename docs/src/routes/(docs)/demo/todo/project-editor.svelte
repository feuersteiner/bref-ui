<script lang="ts">
	import { asset } from '$app/paths';
	import { Button, Dialog, Icon, TextInput } from 'bref-ui';
	import { projectPhotos, type Project } from './tasks.js';
	let {
		open = $bindable(false),
		existingNames = [],
		onSave
	}: {
		open?: boolean;
		existingNames?: string[];
		onSave: (project: Omit<Project, 'id'>) => string;
	} = $props();
	const icons = [
		{ name: 'folder', label: 'Folder' },
		{ name: 'language', label: 'Web' },
		{ name: 'mobile', label: 'Mobile' },
		{ name: 'palette', label: 'Design' },
		{ name: 'code', label: 'Code' },
		{ name: 'rocket_launch', label: 'Launch' }
	] as const;
	const photos = Object.entries(projectPhotos) as [
		Project['photo'],
		(typeof projectPhotos)[Project['photo']]
	][];
	const defaultName = () => {
		const taken = new Set(existingNames.map((label) => label.toLowerCase()));
		let label = 'New project';
		for (let count = 2; taken.has(label.toLowerCase()); count++) label = `New project ${count}`;
		return label;
	};
	let name = $state(defaultName());
	let icon = $state<(typeof icons)[number]['name']>('folder');
	let photo = $state<Project['photo']>('studio');
	let error = $state('');
	const save = (event: SubmitEvent) => {
		event.preventDefault();
		error = onSave({ label: name.trim(), icon: { name: icon }, photo });
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
		<fieldset>
			<legend>Project icon</legend>
			<div data-icons>
				{#each icons as option (option.name)}
					<label data-choice>
						<input type="radio" name="project-icon" value={option.name} bind:group={icon} />
						<Icon name={option.name} size="x-small" />
						<span>{option.label}</span>
					</label>
				{/each}
			</div>
		</fieldset>
		<fieldset>
			<legend>Cover image</legend>
			<div data-photos>
				{#each photos as [value, option] (value)}
					<label data-choice data-photo>
						<img src={asset(option.src)} alt="" width="180" height="72" />
						<span>
							<input type="radio" name="project-photo" {value} bind:group={photo} />
							{option.label}
						</span>
					</label>
				{/each}
			</div>
		</fieldset>
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

<style>
	fieldset {
		min-width: 0;
		margin: 0;
		padding: 0;
		border: 0;
	}
	legend {
		margin-bottom: 8px;
		padding: 0;
		font-size: 13px;
	}
	[data-icons],
	[data-photos] {
		display: grid;
		gap: 8px;
	}
	[data-icons] {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
	[data-photos] {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
	[data-choice] {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		min-height: 44px;
		padding: 8px 4px;
		border: 1px solid var(--relay-rule);
		border-radius: 12px;
		background: var(--relay-panel);
		font-size: 12px;
		cursor: pointer;
	}
	[data-choice]:has(input:checked) {
		border-color: var(--color-primary);
		background: color-mix(in srgb, var(--color-primary) 10%, var(--color-background));
	}
	[data-choice]:has(input:focus-visible) {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}
	input {
		flex-shrink: 0;
		width: 14px;
		height: 14px;
		margin: 0;
		accent-color: var(--color-primary);
	}
	[data-photo] {
		flex-direction: column;
		gap: 0;
		padding: 0;
		overflow: hidden;
	}
	[data-photo] img {
		width: 100%;
		height: 72px;
		object-fit: cover;
	}
	[data-photo] span {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 8px;
	}
	img {
		display: block;
		max-width: 100%;
	}
	label {
		display: grid;
		gap: 8px;
	}
	p {
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
