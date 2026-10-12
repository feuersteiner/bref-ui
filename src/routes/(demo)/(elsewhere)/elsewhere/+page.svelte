<script lang="ts">
	import { onDestroy, onMount, tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import { Button, Icon } from '$lib/index.js';
	import { exampleRun, type AuditRun } from './audits.js';
	import AuditRunView from './audit-run.svelte';
	import AuditLauncher from './audit-launcher.svelte';
	import RunHistory from './run-history.svelte';
	let runs = $state<AuditRun[]>([structuredClone(exampleRun)]);
	let activeId = $state<number | undefined>(1);
	let url = $state(exampleRun.url);
	let motion = $state(0);
	let error = $state('');
	let workspace = $state<HTMLElement>();
	let timer: ReturnType<typeof setInterval> | undefined;
	const active = $derived(runs.find((run) => run.id === activeId));
	const pending = $derived(active?.status === 'running');
	const stop = () => {
		clearInterval(timer);
		runs = runs.map((run) => (run.status === 'running' ? { ...run, status: 'stopped' } : run));
	};
	const focusInput = async () => {
		await tick();
		workspace?.querySelector<HTMLInputElement>('#audit-url')?.focus();
	};
	const newRun = () => {
		stop();
		activeId = undefined;
		url = '';
		error = '';
		void focusInput();
	};
	const select = (run: AuditRun) => {
		if (run.id === activeId) return;
		stop();
		activeId = run.id;
		url = run.url;
		error = '';
	};
	const clear = () => {
		stop();
		runs = runs.filter((run) => run.id !== activeId);
		activeId = undefined;
		error = '';
		void focusInput();
	};
	const start = () => {
		if (pending) return;
		let target: URL;
		try {
			target = new URL(url.trim());
			if (!['https:', 'http:'].includes(target.protocol)) throw new Error('Invalid protocol');
		} catch {
			error = 'Enter a complete website URL, starting with https://.';
			void focusInput();
			return;
		}
		stop();
		error = '';
		url = target.href;
		const run: AuditRun = { id: Date.now(), url, status: 'running', step: 0, reviewed: [] };
		runs = [run, ...runs];
		activeId = run.id;
		timer = setInterval(() => {
			runs = runs.map((item) =>
				item.id === run.id
					? { ...item, step: item.step + 1, status: item.step === 2 ? 'ready' : 'running' }
					: item
			);
			if (runs.find((item) => item.id === run.id)?.status === 'ready') clearInterval(timer);
		}, 800);
	};
	const review = (id: string, checked: boolean) => {
		runs = runs.map((run) =>
			run.id === activeId
				? {
						...run,
						reviewed: checked ? [...run.reviewed, id] : run.reviewed.filter((item) => item !== id)
					}
				: run
		);
	};
	onMount(() => {
		const media = matchMedia('(prefers-reduced-motion: reduce)');
		const update = () => {
			motion = media.matches ? 0 : 220;
		};
		update();
		media.addEventListener('change', update);
		return () => media.removeEventListener('change', update);
	});
	onDestroy(() => clearInterval(timer));
</script>

<svelte:head>
	<title>Elsewhere — a Bref agent workspace demo</title>
	<meta
		name="description"
		content="A simple website review agent with a task plan, sample findings and review controls, built with Bref."
	/>
</svelte:head>
<main id="demo-content" data-agent-workspace tabindex="-1" bind:this={workspace}>
	<header data-agent-header>
		<a href="#demo-content"><Icon name="all_inclusive" />Elsewhere</a>
		<Button label="New run" icon={{ name: 'add' }} glass onClick={newRun} />
	</header>
	<AuditLauncher bind:url {pending} {error} onStart={start} onStop={stop} />
	<p data-visually-hidden role="status">
		{pending
			? 'Sample audit running'
			: active?.status === 'ready'
				? 'Sample audit ready for review'
				: active?.status === 'stopped'
					? 'Audit stopped'
					: 'Ready for a new audit'}
	</p>
	{#if active}
		<AuditRunView
			run={active}
			{motion}
			onReview={review}
			onClear={clear}
			onRerun={() => {
				url = active.url;
				start();
			}}
		/>
	{:else}<section data-agent-empty in:fly={{ y: motion ? 10 : 0, duration: motion }}>
			<Icon name="travel_explore" />
			<h2>Ready when you are</h2>
			<p>Add a website URL to try the sample review.</p>
		</section>{/if}
	{#if runs.length}<RunHistory {runs} {activeId} onSelect={select} />{/if}
</main>
