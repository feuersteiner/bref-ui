<script lang="ts">
	import * as Core from 'bref-ui';
	import * as Paris from 'bref-ui-themes/new-paris';
	import { typeChars } from '../timeline.js';
	let {
		theme = 'core',
		time = 18,
		interactive = false
	}: { theme?: 'core' | 'paris'; time?: number; interactive?: boolean } = $props();
	const kit = $derived(theme === 'paris' ? Paris : Core);
	const Input = $derived(kit.TextInput);
	const Button = $derived(kit.Button);
	const Icon = $derived(kit.Icon);
	const Switch = $derived(kit.Switch);
	const Checkbox = $derived(kit.Checkbox);
	let manualEmail = $state<string>();
	let manualUpdates = $state<boolean>();
	let manualSaved = $state(false);
	let consent = $state(true);
	const email = $derived(manualEmail ?? typeChars('alex@studio.com', (time - 11) / 2));
	const updates = $derived(manualUpdates ?? time < 14.2);
	const saved = $derived(manualSaved || time >= 16);
</script>

<form
	class="mini-form"
	onsubmit={(event) => {
		event.preventDefault();
		manualSaved = true;
	}}
>
	<div class="form-heading">
		<Icon name="auto_awesome" color="primary" size="large" />
		<h2>Create a workspace.</h2>
	</div>
	<label for={`${theme}-name`}>Name</label>
	<Input id={`${theme}-name`} value="Alex Morgan" icon={{ name: 'person' }} size="large" wide />
	<label for={`${theme}-email`}>Email</label>
	<Input
		id={`${theme}-email`}
		type="email"
		value={email}
		oninput={(event) => (manualEmail = event.currentTarget.value)}
		icon={{ name: 'mail' }}
		placeholder="you@studio.com"
		size="large"
		wide
	/>
	<label class="form-option">
		<Switch
			checked={updates}
			onchange={(event) => (manualUpdates = event.currentTarget.checked)}
		/>Product updates
	</label>
	<label class="form-option consent"><Checkbox bind:checked={consent} />I agree to the terms</label>
	<Button
		label={saved ? 'Workspace created' : 'Create workspace'}
		icon={{ name: saved ? 'check' : 'add' }}
		color="primary"
		variant="filled"
		size="large"
		wide
		type="submit"
		disabled={!interactive && !consent}
	/>
</form>
