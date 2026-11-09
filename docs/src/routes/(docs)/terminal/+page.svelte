<script lang="ts">
	import { Button, Terminal, TextArea, TextInput } from 'bref-ui';
	import { componentDocs } from 'bref-ui/docs';
	import ComponentUsage from '../components/component-usage.svelte';
	import Page from '../components/page-container.svelte';
	import Playground from '../components/playground.svelte';
	import PlaygroundField from '../components/playground-field.svelte';
	import PlaygroundGroup from '../components/playground-group.svelte';
	import PropTable from '../components/prop-table.svelte';
	import Section from '../components/section.svelte';
	import { chapter, sections } from './sections.js';

	const doc = componentDocs.terminal;
	const initialOutput =
		'$ bun install\n✓ Dependencies installed\n\n$ bun run dev\nReady when you are. ♡';
	let output = $state(initialOutput);
	let windowTitle = $state('bref — terminal');
	let lines = $state(['$ bun run build', '✓ Checking components']);
	let focusEvents = $state(0);
	// Keep literal closing tags out of the generated Svelte source and its formatter.
	const serializedLines = $derived(
		JSON.stringify(output === '' ? [] : output.split('\n')).replaceAll('<', '\\u003c')
	);
	const serializedTitle = $derived(JSON.stringify(windowTitle).replaceAll('<', '\\u003c'));
	const source = $derived(`<script>
  import { Terminal } from 'bref-ui';
<${'/'}script>

<Terminal lines={${serializedLines}} windowTitle={${serializedTitle}} />`);
	const reset = () => {
		output = initialOutput;
		windowTitle = 'bref — terminal';
	};
</script>

<Page title={chapter} description={doc.description}>
	<Section {...sections[0]}>
		<Terminal lines={['$ bun install', '✓ Ready to build']} />
		<ComponentUsage usage={doc.usage} />
	</Section>
	<Section {...sections[1]}>
		<Playground {source} onReset={reset}>
			{#snippet preview()}
				<Terminal lines={output === '' ? [] : output.split('\n')} {windowTitle} />
			{/snippet}
			<PlaygroundGroup title="Window and output">
				<PlaygroundField id="terminal-title" label="Window title">
					<TextInput id="terminal-title" bind:value={windowTitle} />
				</PlaygroundField>
				<PlaygroundField id="terminal-lines" label="Output (one entry per line)">
					<TextArea id="terminal-lines" bind:value={output} rows={8} wide />
				</PlaygroundField>
			</PlaygroundGroup>
		</Playground>
	</Section>
	<Section {...sections[2]}>
		<h3>Empty output and hidden title</h3>
		<Terminal lines={[]} windowTitle="" aria-label="Empty terminal" />
		<h3>Whitespace, Unicode and literal markup</h3>
		<Terminal
			windowTitle="hello — café / 東京 / ♡"
			lines={[
				'  first column\tsecond column',
				'',
				'<strong>Still plain text.</strong>',
				'✓ Voilà!'
			]}
		/>
		<h3>Long output and native customization</h3>
		<p id="terminal-scroll-help">
			Tab into the viewport, then use arrow keys to scroll in either direction.
		</p>
		<Terminal
			windowTitle="A very long window title that should truncate without displacing the traffic lights"
			aria-describedby="terminal-scroll-help"
			style="max-height: 12rem"
			lines={Array.from(
				{ length: 20 },
				(_, index) => `${String(index + 1).padStart(2, '0')}  ${'Long build output · '.repeat(12)}`
			)}
		/>
		<h3>Updating output</h3>
		<Terminal
			{lines}
			windowTitle="build.log"
			aria-label="Build output"
			title="A native tooltip"
			onfocus={() => focusEvents++}
		/>
		<div>
			<Button
				label="Append a line"
				onClick={() => (lines = [...lines, `✓ Step ${lines.length} complete`])}
			/>
			<Button label="Clear output" onClick={() => (lines = [])} />
		</div>
		<p>Native focus events: {focusEvents}. Updates do not move focus or force scrolling.</p>
	</Section>
	<Section {...sections[3]}>
		<PropTable props={doc.props} />
	</Section>
</Page>

<style>
	h3 {
		margin-block: 1.75rem 0.75rem;
	}
	div {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-block: 1rem;
	}
</style>
