<script lang="ts">
	/* eslint-disable max-lines -- Keep the progress controls and interactive examples together. */
	import { Progress, TextInput, Select, Checkbox, Button } from '$lib/index.js';
	import type { BaseSize } from '$lib/types.js';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import CodeSnippet from '../components/code-snippet.svelte';
	import PropTable from '../components/prop-table.svelte';
	import { chapter, sections } from './sections.js';

	const sizes: BaseSize[] = ['small', 'medium', 'large'];
	let value = $state(0.35);
	let disabled = $state(false);
	let size = $state<BaseSize>('medium');
	let nativeEvent = $state('No native input or change event yet.');
	let formResult = $state('Submit to read the native range value.');
	const props = [
		{
			name: 'label',
			type: 'string',
			required: false,
			default: '—',
			description: 'Optional accessible name of the indicator or seek control.'
		},
		{
			name: 'value',
			type: 'number',
			required: false,
			default: 'Omitted',
			description: 'Normalized value from 0 to 1. Omit for indeterminate progress.'
		},
		{
			name: 'onSeek',
			type: '(value: number) => void',
			required: false,
			default: 'Omitted',
			description: 'Makes progress seekable and emits normalized values on edits.'
		},
		{
			name: 'disabled',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Disables the seek control when present.'
		},
		{
			name: 'size',
			type: 'BaseSize',
			required: false,
			default: 'medium',
			description: 'Track thickness: small, medium, or large.'
		}
	];
</script>

<Page
	title={chapter}
	description="Show determinate or indeterminate progress, with an optional controlled seek control."
>
	<Section {...sections[0]}>
		<Progress label="Upload progress" value={0.4} />
		<CodeSnippet
			label="Progress usage code"
			source={'<Progress label="Upload progress" value={0.4} />'}
		/>
	</Section>
	<Section {...sections[1]}>
		<div class="example">
			<span>0 / 0.5 / 1</span>
			<Progress label="Not started" value={0} /><Progress
				label="Half complete"
				value={0.5}
			/><Progress label="Complete" value={1} />
		</div>
		{#each sizes as size (size)}
			<div class="example">
				<span>{size}</span>
				<Progress label={`${size} upload`} {size} value={0.65} /><Progress
					label={`${size} loading`}
					{size}
				/>
			</div>
		{/each}
	</Section>
	<Section {...sections[2]}>
		<div class="controls">
			<label>
				Value <TextInput
					type="number"
					min="0"
					max="1"
					step="0.01"
					value={String(value)}
					oninput={(event) => {
						const next = event.currentTarget.valueAsNumber;
						if (Number.isFinite(next)) value = next;
					}}
				/>
			</label>
			<div data-control>
				<label for="progress-size">Size</label>
				<Select
					id="progress-size"
					items={sizes.map((id) => ({ id, label: id }))}
					bind:value={() => size, (next) => (size = next as typeof size)}
				/>
			</div>
			<label>
				<Checkbox bind:checked={disabled} />
				Disabled
			</label>
		</div>
		<form
			onsubmit={(event) => {
				event.preventDefault();
				formResult = `Submitted position: ${event.currentTarget.querySelector('input')?.value}`;
			}}
			onreset={(event) => {
				event.preventDefault();
				value = 0.35;
				formResult = 'Reset position to 0.35.';
			}}
		>
			<Progress
				label="Playback position"
				id="playback-position"
				title="Seek through playback"
				aria-describedby="progress-native-event"
				{value}
				{size}
				{disabled}
				onSeek={(next) => (value = next)}
				oninput={(event) => (nativeEvent = `Input: ${event.currentTarget.value}`)}
				onchange={(event) => (nativeEvent = `Change: ${event.currentTarget.value}`)}
			/>
			<div class="controls">
				<Button type="submit" label="Submit position" />
				<Button type="reset" label="Reset position" />
			</div>
		</form>
		<p id="progress-native-event">{nativeEvent} {formResult}</p>
		<p>The form's reset handler prevents the native reset and restores the controlled value.</p>
		<p>
			Current: {value.toFixed(2)} ({Math.round(value * 100)}%). Drag, tap, or use Arrow, Home, and
			End keys.
		</p>
		<CodeSnippet
			label="Seekable progress code"
			source={'<Progress label="Playback position" {value} onSeek={(next) => value = next} />'}
		/>
	</Section>
	<Section {...sections[3]}>
		<div dir="rtl">
			<p>Right-to-left playback: {value.toFixed(2)}</p>
			<Progress label="RTL seek position" {value} onSeek={(next) => (value = next)} />
			<Progress label="Right-to-left loading" />
		</div>
		<div>
			<p>Disabled seek control</p>
			<Progress label="Disabled seek position" value={0.65} disabled onSeek={() => {}} />
		</div>
	</Section>
	<Section {...sections[4]}>
		<PropTable {props} />
		<p>
			The indicator uses a native progress element with a fixed maximum of 1. Seekable progress
			exposes a native range control. Add a label or an external label association when an
			accessible name is needed. Native attributes and events forward to the progress indicator, or
			to the range control when seeking, including <code>aria-valuetext</code>
			and
			<code>aria-controls</code>
			. Indeterminate progress omits its value. No live region repeats value changes. The fill uses the
			primary theme color. Reduced motion leaves a visible, stationary segment for indeterminate progress.
		</p>
	</Section>
</Page>

<style>
	.example {
		display: grid;
		grid-template-columns: minmax(5rem, 8rem) repeat(3, minmax(0, 1fr));
		align-items: center;
		gap: 1rem;
	}
	.controls {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}
	.controls label {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}
	@media (max-width: 575px) {
		.example {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	[data-control] {
		display: grid;
		gap: 0.5rem;
		width: min(100%, 12rem);
		min-width: 0;
	}
</style>
