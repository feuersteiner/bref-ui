<script lang="ts">
	import {
		Button,
		Checkbox,
		Icon,
		Pill,
		Progress,
		Select,
		Switch,
		TextInput
	} from 'bref-ui-themes/vscode';
	import { typeChars } from '../timeline.js';
	let { time }: { time: number } = $props();
	let checks = $state(true);
	let auto = $state(true);
	let model = $state('balanced');
	let applied = $state(false);
	const ready = $derived(applied || time >= 13);
</script>

<section class="ade-agent">
	<header>
		<Icon name="auto_awesome" filled />
		<strong>Settings refinement</strong>
		<Pill label={ready ? 'Done' : 'Working'} color={ready ? 'success' : 'primary'} size="small" />
	</header>
	<div class="agent-conversation">
		<div class="user-message">Add notification preferences. Use the local Switch component.</div>
		<div class="agent-message">
			<Icon name="deployed_code" filled />
			<p>
				{typeChars(
					'The local components are ready. Adding a settings panel with the existing design tokens.',
					time / 4
				)}
			</p>
		</div>
		<div class="agent-tool">
			<Icon name="folder_open" />
			<span>Read src/lib/ui/switch.svelte</span>
			<Icon name="check" />
		</div>
		{#if time >= 5}<div class="agent-diff">
				<div>
					+page.svelte <span>+8 −0</span>
				</div>
				<pre>+ &lt;Switch bind:checked=&#123;notifications&#125; /&gt;&#10;+ Product notifications</pre>
			</div>{/if}
		<div class="agent-options">
			<label><Switch bind:checked={auto} />Auto-apply edits</label>
			<label><Checkbox bind:checked={checks} />Run checks</label>
			<Progress value={ready ? 1 : Math.min(time / 14, 0.9)} label="Agent progress" />
		</div>
		<Button
			label={ready ? 'Changes applied' : 'Apply changes'}
			icon={{ name: ready ? 'check' : 'done_all' }}
			variant="filled"
			color="primary"
			wide
			onClick={() => (applied = true)}
		/>
	</div>
	<footer>
		<TextInput placeholder="Ask ADE to build something…" aria-label="Message ADE" wide />
		<div>
			<label for="agent-model" class="sr-only">Agent model</label>
			<Select
				items={[
					{ id: 'balanced', label: 'Balanced' },
					{ id: 'fast', label: 'Fast' }
				]}
				bind:value={model}
				id="agent-model"
			/><Button icon={{ name: 'arrow_upward' }} variant="filled" aria-label="Send message" />
		</div>
	</footer>
</section>
