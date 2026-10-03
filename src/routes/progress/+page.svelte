<script lang="ts">
	import { Progress } from '$lib/index.js';
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
			<Progress value={0} /><Progress value={0.5} /><Progress value={1} />
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
				Value <input
					type="number"
					min="0"
					max="1"
					step="0.01"
					{value}
					oninput={(event) => {
						const next = event.currentTarget.valueAsNumber;
						if (Number.isFinite(next)) value = next;
					}}
				/>
			</label>
			<label>
				Size <select bind:value={size}>
					{#each sizes as item (item)}<option value={item}>{item}</option>{/each}
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
			{size}
			{disabled}
			onSeek={(next) => (value = next)}
		/>
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
		<PropTable {props} />
		<p>
			The indicator uses a native progress element with a fixed maximum of 1. Seekable progress
			exposes a native range control. Add a label or an external label association when an
			accessible name is needed. Native progress attributes forward to the indicator; <code>
				id
			</code>
			and
			<code>aria-describedby</code>
			attach to the range control when seeking. Indeterminate progress omits its value. No live region
			repeats value changes. The fill uses the primary theme color. Motion stops when reduced motion is
			requested.
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
	.controls input[type='number'] {
		width: 5rem;
	}
	@media (max-width: 575px) {
		.example {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
