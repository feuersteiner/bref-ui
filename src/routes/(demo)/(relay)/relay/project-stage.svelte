<script lang="ts">
	import { asset } from '$app/paths';
	import { Icon, Progress, Surface } from '$lib/index.js';
	import { Tween, prefersReducedMotion } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	let {
		project,
		photo,
		projectName,
		completed,
		total
	}: { project: string; photo: string; projectName: string; completed: number; total: number } =
		$props();
	const progress = Tween.of(() => (total ? completed / total : 0), {
		duration: () => (prefersReducedMotion.current ? 0 : 400),
		easing: cubicOut
	});
</script>

<header data-project-stage data-project={project}>
	<img src={asset(`/demos/relay-${photo}.jpg`)} alt="" width="1600" height="900" />
	<div data-project-caption>
		<h1>{projectName}</h1>
		<Surface
			glass
			variant="filled"
			color="background"
			radius="medium"
			spacing="medium"
			width="fit"
			data-project-progress
		>
			<span><Icon name="check_circle" />Completed {completed} of {total}</span>
			<Progress value={progress.current} label="Project completion" />
		</Surface>
	</div>
</header>
