<script lang="ts">
	import { chapter, sections } from './sections.js';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import CodeSnippet from '../components/code-snippet.svelte';
	import PropTable from '../components/prop-table.svelte';
	import { Icon, Switch, Button } from '$lib/index.js';
	import type { BaseSize } from '$lib/types.js';

	const sizes: BaseSize[] = ['small', 'medium', 'large'];
	let enabled = $state(false);
	let submitted = $state('No submission yet.');
	const source = `<script>\n  import { Icon, Switch } from 'bref-ui';\n  let enabled = $state(false);\n<${'/'}script>\n\n<label>\n  <Switch name="notifications" bind:checked={enabled}>\n    {#if enabled}<Icon name="dark_mode" />{:else}<Icon name="light_mode" />{/if}\n  </Switch>\n  Notifications\n</label>`;
	const props = [
		{
			name: 'checked',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Bindable on/off state.'
		},
		{
			name: 'size',
			type: 'BaseSize',
			required: false,
			default: 'medium',
			description: 'small, medium or large.'
		},
		{
			name: 'children',
			type: 'Snippet',
			required: false,
			default: 'Omitted',
			description: 'Decorative content rendered inside the thumb.'
		}
	];
</script>

<Page title={chapter} description="A checkbox-based on/off control with native form behavior.">
	<Section {...sections[0]}>
		<label>
			<Switch name="notifications" bind:checked={enabled}>
				{#if enabled}<Icon name="dark_mode" />{:else}<Icon name="light_mode" />{/if}
			</Switch>
			Notifications
		</label>
		<p role="status">Notifications {enabled ? 'on' : 'off'}.</p>
		<CodeSnippet {source} label="Switch usage code" />
	</Section>
	<Section {...sections[1]}>
		<div>
			{#each sizes as size (size)}
				<label><Switch {size} aria-label={`${size} switch`} /> {size}</label>
				<label><Switch {size} checked aria-label={`${size} checked switch`} /> {size} on</label>
			{/each}
			<label><Switch disabled /> Disabled</label>
			<label><Switch checked disabled /> Disabled on</label>
		</div>
	</Section>
	<Section {...sections[2]}>
		<PropTable {props} />
		<p>
			Native checkbox attributes and events are forwarded. Use a wrapping label or <code>
				aria-label
			</code>
			for an accessible name. Bind
			<code>checked</code>
			as needed. The optional children snippet renders decorative content inside the thumb; keep interactive
			elements outside the switch.
		</p>
	</Section>
	<Section {...sections[3]}>
		<p>
			Tab to focus and press Space to toggle. A named switch submits its value only while checked;
			disabled switches do not submit.
		</p>
		<form
			onsubmit={(event) => {
				event.preventDefault();
				submitted = new FormData(event.currentTarget).get('updates')?.toString() ?? '(empty)';
			}}
		>
			<label><Switch name="updates" value="yes" /> Receive updates</label>
			<Button label="Submit" onClick={() => undefined} type="submit" />
			<Button label="Reset" onClick={() => undefined} type="reset" />
		</form>
		<p role="status">Submitted: {submitted}</p>
	</Section>
	<Section {...sections[4]}>
		<div>
			<label><Switch aria-invalid="true" /> Invalid off</label>
			<label><Switch checked aria-invalid="true" /> Invalid on</label>
			<label><Switch /> Keyboard focus</label>
		</div>
		<p>
			Tab through these controls to check focus. Native validation after interaction and
			aria-invalid retain a quiet error edge without hiding focus.
		</p>
	</Section>
</Page>

<style>
	div {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem 2rem;
	}
	label {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		min-block-size: 2.75rem;
	}
	form {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem;
	}
</style>
