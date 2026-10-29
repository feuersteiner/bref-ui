<script lang="ts">
	import { Icon, Pill, Tabs, TextInput, Theme, TreeView } from 'bref-ui-themes/vscode';
	import type { TreeItemProps } from 'bref-ui/types';
	import AdeAgent from './ade-agent.svelte';
	import Editor from '../components/editor.svelte';
	let { time }: { time: number } = $props();
	let activity = $state('files');
	let file = $state<string | string[]>('switch');
	const source = $derived(
		`<script lang="ts">\n  import { Switch } from '#bref';\n  let notifications = $state(true);\n\x3c/script>\n\n<section class="preferences">\n  <h2>Workspace settings</h2>\n  <label>\n    <Switch bind:checked={notifications} />\n    Product notifications\n  </label>\n</section>`
	);
	const items: TreeItemProps[] = [
		{
			id: 'src',
			label: 'src',
			icon: { name: 'folder' },
			children: [
				{
					id: 'routes',
					label: 'routes',
					icon: { name: 'folder' },
					children: [{ id: 'page', label: '+page.svelte', icon: { name: 'code' } }]
				},
				{
					id: 'lib',
					label: 'lib / ui',
					icon: { name: 'folder' },
					children: [
						{ id: 'switch', label: 'switch.svelte', icon: { name: 'toggle_on' } },
						{ id: 'button', label: 'button.svelte', icon: { name: 'widgets' } },
						{ id: 'theme', label: 'theme.svelte', icon: { name: 'palette' } }
					]
				}
			]
		},
		{ id: 'package', label: 'package.json', icon: { name: 'data_object' } }
	];
</script>

<Theme>
	<div class="code-app">
		<nav class="workbench-menubar" aria-label="ADE workspace">
			<strong><Icon name="deployed_code" filled /> ADE</strong>
			<span>bref-ui / workspace</span>
			<Pill label="LOCAL" color="success" size="small" />
		</nav>
		<div class="workbench-body">
			<aside class="activity-bar">
				<Tabs
					orientation="vertical"
					items={[
						{ id: 'files', label: 'Files', icon: 'folder_open' },
						{ id: 'search', label: 'Search', icon: 'search' },
						{ id: 'changes', label: 'Source control', icon: 'account_tree' },
						{ id: 'agents', label: 'Agents', icon: 'auto_awesome' }
					]}
					bind:value={activity}
					label="Activity"
				/>
			</aside>
			<aside class="workbench-explorer">
				<h2>EXPLORER</h2>
				<TextInput
					placeholder="Find a file…"
					aria-label="Find a file"
					icon={{ name: 'search' }}
					wide
				/><TreeView {items} bind:selection={file} defaultExpanded label="Workspace files" />
				<div class="agent-session">
					<Icon name="auto_awesome" />
					<div>
						<strong>Settings refinement</strong>
						<p>1 agent · main</p>
					</div>
					<span class="live-dot"></span>
				</div>
			</aside>
			<section class="workbench-editor">
				<header>
					<Icon name="code" />
					<span>+page.svelte</span>
					<span class="editor-modified">M</span>
				</header>
				<div class="editor-breadcrumb">
					src <span>›</span>
					routes
					<span>›</span>
					+page.svelte
				</div>
				<div class="ade-source">
					<div class="line-numbers">
						{#each Array.from({ length: 14 }, (_, i) => i + 1) as line (line)}<span>
								{line}
							</span>{/each}
					</div>
					<Editor {source} />
				</div>
				<div class="workbench-terminal">
					<h3>
						TERMINAL <span>+ ×</span>
					</h3>
					<code>
						<span>~/bref-ui</span>
						$ bun run check
					</code>
					<code class="terminal-result">
						{time >= 9 ? '✓ 0 errors · 0 warnings' : 'Checking Svelte components…'}
					</code>
				</div>
			</section>
			<AdeAgent {time} />
		</div>
		<div class="ade-status">
			<span>⑂ main &nbsp; ✓ All changes saved</span>
			<span>Svelte &nbsp; UTF-8 &nbsp; Local agent</span>
		</div>
	</div>
</Theme>
