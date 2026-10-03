<script lang="ts">
	/* eslint-disable max-lines -- The examples, controls and prop table belong on one documentation page. */
	import { Progress } from '$lib/index.js';
	import type { BaseSize, Color } from '$lib/types.js';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import CodeSnippet from '../components/code-snippet.svelte';
	import PropTable from '../components/prop-table.svelte';
	import { chapter, sections } from './sections.js';

	const sizes: BaseSize[] = ['small', 'medium', 'large'];
	const colors: Color[] = [
		'primary',
		'secondary',
		'foreground',
		'background',
		'muted',
		'info',
		'success',
		'warning',
		'error'
	];
	let value = $state(0.35);
	let max = $state(1);
	let disabled = $state(false);
	let color = $state<Color>('primary');
	let size = $state<BaseSize>('medium');
	let committed = $state(0.35);
	const props = [
		{
			name: 'label',
			type: 'string',
			required: true,
			default: '—',
			description: 'Accessible name of the indicator or seek control.'
		},
		{
			name: 'value',
			type: 'number',
			required: false,
			default: 'Omitted',
			description: 'Finite progress value. Omit for indeterminate mode; required for seeking.'
		},
		{
			name: 'max',
			type: 'number',
			required: false,
			default: '1',
			description: 'Finite positive upper bound. Values clamp to 0 through max.'
		},
		{
			name: 'onSeek',
			type: '(value: number) => void',
			required: false,
			default: 'Omitted',
			description: 'Makes progress seekable; update the controlled value.'
		},
		{
			name: 'onSeekCommit',
			type: '(value: number) => void',
			required: false,
			default: 'Omitted',
			description: 'Runs when a seek interaction ends.'
		},
		{
			name: 'disabled',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Disables only seekable progress.'
		},
		{
			name: 'size',
			type: 'BaseSize',
			required: false,
			default: 'medium',
			description: 'Track thickness: small, medium, or large.'
		},
		{
			name: 'color',
			type: 'Color',
			required: false,
			default: 'primary',
			description: 'Theme color for the filled track.'
		},
		{
			name: 'ref',
			type: 'HTMLProgressElement',
			required: false,
			default: 'null',
			description: 'Bindable native progress element reference.'
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
		<h3>Determinate and indeterminate</h3>
		{#each sizes as size (size)}
			<div class="example">
				<span>{size}</span>
				<Progress label={`${size} upload`} {size} value={0.65} /><Progress
					label={`${size} loading`}
					{size}
				/>
			</div>
		{/each}
		<h3>Colors</h3>
		{#each colors as color (color)}
			<div class="example">
				<span>{color}</span>
				<Progress label={`${color} progress`} {color} value={0.6} />
			</div>
		{/each}
	</Section>
	<Section {...sections[2]}>
		<div class="controls">
			<label>
				Value <input
					type="number"
					min="0"
					{max}
					step="0.01"
					{value}
					oninput={(event) => {
						const next = event.currentTarget.valueAsNumber;
						if (Number.isFinite(next)) value = next;
					}}
				/>
			</label>
			<label>
				Maximum <input
					type="number"
					min="0.01"
					step="0.01"
					value={max}
					oninput={(event) => {
						const next = event.currentTarget.valueAsNumber;
						if (Number.isFinite(next) && next > 0) max = next;
					}}
				/>
			</label>
			<label>
				Size <select bind:value={size}>
					{#each sizes as item (item)}<option value={item}>{item}</option>{/each}
				</select>
			</label>
			<label>
				Color <select bind:value={color}>
					{#each colors as item (item)}<option value={item}>{item}</option>{/each}
				</select>
			</label>
			<label>
				<input type="checkbox" bind:checked={disabled} />
				Disabled
			</label>
		</div>
		<Progress
			label="Playback position"
			{value}
			{max}
			{size}
			{color}
			{disabled}
			onSeek={(next) => (value = next)}
			onSeekCommit={(next) => (committed = next)}
		/>
		<p>
			Current: {value.toFixed(2)}; last committed: {committed.toFixed(2)}. Drag, tap, or use Arrow,
			Home, and End keys.
		</p>
		<CodeSnippet
			label="Seekable progress code"
			source={'<Progress label="Playback position" {value} onSeek={(next) => value = next} />'}
		/>
	</Section>
	<Section {...sections[3]}>
		<PropTable {props} />
		<p>
			The indicator uses a native progress element. Seekable progress exposes a native range control
			with a single accessible name. Native progress attributes, including <code>id</code>
			and
			<code>aria-describedby</code>
			, forward to the progress element. Indeterminate progress omits its value. No live region repeats
			value changes. Motion stops when reduced motion is requested.
		</p>
	</Section>
</Page>

<style>
	.example {
		display: grid;
		grid-template-columns: minmax(5rem, 8rem) minmax(0, 1fr) minmax(0, 1fr);
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
	.controls input[type='number'] {
		width: 5rem;
	}
	@media (max-width: 575px) {
		.example {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
