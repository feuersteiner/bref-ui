<script lang="ts">
	import { Button, Checkbox, Progress, Surface, Switch, Theme } from 'bref-ui-themes/glassy';
	let { time }: { time: number } = $props();
	let playing = $state(true);
	let focused = $state(false);
	let done = $state(false);
	const phase = $derived(time < 4.5 ? 0 : time < 9 ? 1 : time < 14 ? 2 : 3);
	$effect(() => {
		const step = phase;
		playing = step < 1;
		focused = step >= 2;
		done = step >= 3;
	});
</script>

<Theme>
	<div class="glass-app">
		<div class="glass-shape glass-shape-one" style:transform={`rotate(${-15 + time}deg)`}></div>
		<div class="glass-shape glass-shape-two"></div>
		<nav class="glass-nav" aria-label="Daydream">daydream</nav>
		<div class="glass-greeting">
			<h2>
				Good
				<br />
				morning.
			</h2>
		</div>
		<div class="glass-widgets">
			<Surface glass variant="soft" radius="large" spacing="large" class="music-widget">
				<div class="widget-heading">Now playing</div>
				<div class="record" style:transform={`rotate(${playing ? time * 12 : 22}deg)`}>
					<div>✳</div>
				</div>
				<h3>Somewhere softer</h3>
				<Progress value={0.25 + time / 50} label="Track progress" />
				<div class="music-controls">
					<Button
						icon={{ name: 'skip_previous' }}
						rounded
						glass
						aria-label="Previous track"
					/><Button
						icon={{ name: playing ? 'pause' : 'play_arrow' }}
						rounded
						variant="filled"
						color="primary"
						size="large"
						aria-label={playing ? 'Pause music' : 'Play music'}
						onClick={() => (playing = !playing)}
					/><Button icon={{ name: 'skip_next' }} rounded glass aria-label="Next track" />
				</div>
			</Surface>
			<div class="glass-right-widgets">
				<Surface glass variant="soft" radius="large" spacing="large" class="focus-widget">
					<h3>Focus</h3>
					<label><Switch bind:checked={focused} />Do not disturb</label>
				</Surface><Surface glass variant="soft" radius="large" spacing="large" class="todo-widget">
					<h3>Today</h3>
					<label>
						<Checkbox bind:checked={done} />
						<span class:checked={done}>Make something lovely</span>
					</label>
					<label><Checkbox checked />Go outside</label>
					<Progress value={done ? 1 : 0.5} label="Tasks completed" />
				</Surface>
			</div>
		</div>
	</div>
</Theme>
