<script lang="ts">
	import { componentDocs } from 'bref-ui/docs';
	import ComponentUsage from '../components/component-usage.svelte';
	/* eslint-disable max-lines -- Keep the progress controls and interactive examples together. */
	import { Progress, TextInput, Select, Checkbox, Button } from 'bref-ui';
	import type { BaseSize } from 'bref-ui/types';

	import Playground from '../components/playground.svelte';
	import PlaygroundField from '../components/playground-field.svelte';
	import PlaygroundGroup from '../components/playground-group.svelte';
	import Page from '../components/page-container.svelte';
	import Section from '../components/section.svelte';
	import PropTable from '../components/prop-table.svelte';
	import { chapter, sections } from './sections.js';

	const doc = componentDocs['progress'];
	const props = doc.props;

	const sizes: BaseSize[] = ['small', 'medium', 'large'];
	let value = $state(0.35);
	let disabled = $state(false);
	let size = $state<BaseSize>('medium');
	let nativeEvent = $state('No native input or change event yet.');
	let formResult = $state('Submit to read the native range value.');
	let previewValue = $state(0.4);
	let previewLabel = $state('Upload progress');
	let previewSize = $state<BaseSize>('medium');
	let previewDisabled = $state(false);
	let indeterminate = $state(false);
	let seekable = $state(false);
	let rtl = $state(false);
	const playgroundSource = $derived(`<script>
  import { Progress } from 'bref-ui';
  let value = $state(${previewValue});
<${'/'}script>

<div dir="${rtl ? 'rtl' : 'ltr'}">
  <Progress label={${JSON.stringify(previewLabel)}} size=${JSON.stringify(previewSize)} ${indeterminate ? '' : '{value} '}disabled={${previewDisabled}}${seekable ? ' onSeek={(next) => value = next}' : ''} />
</div>`);
	const resetPlayground = () => {
		previewValue = 0.4;
		previewLabel = 'Upload progress';
		previewSize = 'medium';
		previewDisabled = false;
		indeterminate = false;
		seekable = false;
		rtl = false;
	};
</script>

<Page title={chapter} description={doc.description}>
	<Section {...sections.find((section) => section.id === 'usage')!}>
		<Progress label="Upload progress" value={0.4} />
		<ComponentUsage usage={doc.usage} />
	</Section>
	<Section {...sections.find((section) => section.id === 'playground')!}>
		<Playground source={playgroundSource} onReset={resetPlayground}>
			{#snippet preview()}<div data-demo="preview" dir={rtl ? 'rtl' : 'ltr'}>
					<Progress
						label={previewLabel}
						size={previewSize}
						value={indeterminate ? undefined : previewValue}
						disabled={previewDisabled}
						onSeek={seekable ? (next) => (previewValue = next) : undefined}
					/>
				</div>{/snippet}
			{#snippet status()}<p>
					{indeterminate ? 'Unknown progress' : `${Math.round(previewValue * 100)}% complete`}
				</p>{/snippet}
			<PlaygroundGroup title="Appearance">
				<PlaygroundField id="progress-previewSize" label="Size">
					<Select
						id="progress-previewSize"
						items={sizes.map((id) => ({ id, label: id }))}
						bind:value={() => previewSize, (next) => (previewSize = next as typeof previewSize)}
					/>
				</PlaygroundField><PlaygroundField id="progress-previewLabel" label="Accessible label">
					<TextInput id="progress-previewLabel" bind:value={previewLabel} />
				</PlaygroundField>
			</PlaygroundGroup>
			<PlaygroundGroup title="State">
				<PlaygroundField id="progress-previewValue" label="Value (0–1)">
					<TextInput
						id="progress-previewValue"
						type="number"
						min={0}
						max={1}
						step={0.01}
						value={String(previewValue)}
						oninput={(event) => {
							const next = event.currentTarget.valueAsNumber;
							if (Number.isFinite(next)) previewValue = Math.max(0, Math.min(1, next));
						}}
					/>
				</PlaygroundField><PlaygroundField id="progress-indeterminate" label="Indeterminate" toggle>
					<Checkbox id="progress-indeterminate" bind:checked={indeterminate} />
				</PlaygroundField><PlaygroundField id="progress-seekable" label="Seekable" toggle>
					<Checkbox id="progress-seekable" bind:checked={seekable} />
				</PlaygroundField><PlaygroundField id="progress-previewDisabled" label="Disabled" toggle>
					<Checkbox id="progress-previewDisabled" bind:checked={previewDisabled} />
				</PlaygroundField><PlaygroundField id="progress-rtl" label="Right to left" toggle>
					<Checkbox id="progress-rtl" bind:checked={rtl} />
				</PlaygroundField>
			</PlaygroundGroup>
		</Playground>
	</Section>
	<Section {...sections.find((section) => section.id === 'states')!}>
		<div data-demo="matrix">
			<span>0 / 0.5 / 1</span>
			<Progress label="Not started" value={0} /><Progress
				label="Half complete"
				value={0.5}
			/><Progress label="Complete" value={1} />
		</div>
		{#each sizes as size (size)}
			<div data-demo="matrix">
				<span>{size}</span>
				<Progress label={`${size} upload`} {size} value={0.65} /><Progress
					label={`${size} loading`}
					{size}
				/>
			</div>
		{/each}
	</Section>
	<Section {...sections.find((section) => section.id === 'seek')!}>
		<div data-demo="controls">
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
			<div data-demo="controls">
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
	</Section>
	<Section {...sections.find((section) => section.id === 'direction-disabled')!}>
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
	<Section {...sections.find((section) => section.id === 'props')!}>
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
	[data-demo='preview'] {
		width: 100%;
	}
	[data-demo='matrix'] {
		display: grid;
		grid-template-columns: minmax(5rem, 8rem) repeat(3, minmax(0, 1fr));
		align-items: center;
		gap: 1rem;
	}
	[data-demo='controls'] {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}
	[data-demo='controls'] label {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}
	@media (max-width: 575px) {
		[data-demo='matrix'] {
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
