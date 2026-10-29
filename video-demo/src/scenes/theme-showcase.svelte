<script lang="ts">
	import Paris from '../showcases/paris.svelte';
	import Code from '../showcases/code.svelte';
	import Glass from '../showcases/glass.svelte';
	let { id, time }: { id: string; time: number } = $props();
	const details: Record<string, { name: string; tagline: string; path: string; number: string }> = {
		paris: { name: 'New Paris', tagline: 'Style with intention.', path: 'new-paris', number: '01' },
		vscode: { name: 'VS Code', tagline: 'Build your next dev tool.', path: 'vscode', number: '02' },
		glassy: {
			name: 'Glassy',
			tagline: 'A little glass. A lot of personality.',
			path: 'glassy',
			number: '03'
		}
	};
</script>

<div class="theme-heading">
	<div>
		<p class="eyebrow">
			THREE THEMES. YOUR KIND OF BEAUTIFUL. <span>/ {details[id].number}</span>
		</p>
		<h1>
			{details[id].name}
			<em>{details[id].tagline}</em>
		</h1>
	</div>
	<span class="theme-badge">bref-ui-themes/{details[id].path}</span>
</div>
<div class="theme-application">
	{#if id === 'paris'}<Paris {time} />{:else if id === 'vscode'}<Code {time} />{:else}<Glass
			{time}
		/>{/if}
</div>
<div class="theme-bottom">
	<code>import &#123; Theme, Button &#125; from 'bref-ui-themes/{details[id].path}'</code>
	<span>ACTUAL THEME COMPONENTS. NO IMITATIONS.</span>
</div>
