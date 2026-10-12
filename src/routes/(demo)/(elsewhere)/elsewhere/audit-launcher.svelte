<script lang="ts">
	import { Button, Icon, TextInput } from '$lib/index.js';
	let {
		url = $bindable(''),
		pending,
		error,
		onStart,
		onStop
	}: {
		url?: string;
		pending: boolean;
		error: string;
		onStart: () => void;
		onStop: () => void;
	} = $props();
</script>

<section data-agent-intro aria-labelledby="agent-heading">
	<span data-agent-symbol><Icon name="travel_explore" /></span>
	<div>
		<h1 id="agent-heading">Review a website</h1>
		<p>Check clarity, navigation and the buying flow.</p>
	</div>
</section>
<form
	data-agent-form
	onsubmit={(event) => {
		event.preventDefault();
		onStart();
	}}
>
	<label for="audit-url" data-visually-hidden>Website URL</label>
	<TextInput
		id="audit-url"
		bind:value={url}
		icon={{ name: 'language' }}
		placeholder="https://your-website.com"
		wide
		glass
		type="url"
		required
		disabled={pending}
		aria-invalid={error ? 'true' : undefined}
		aria-describedby="audit-disclosure"
	/>
	{#if pending}<Button label="Stop" icon={{ name: 'stop' }} onClick={onStop} />{:else}<Button
			label="Run audit"
			icon={{ name: 'play_arrow' }}
			type="submit"
			variant="filled"
			color="primary"
		/>{/if}
</form>
{#if error}<p data-agent-error role="alert">{error}</p>{/if}
<p id="audit-disclosure" data-agent-disclosure>
	Local demo · Uses a sample furniture store. No website is fetched.
</p>
