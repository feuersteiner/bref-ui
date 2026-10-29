<script lang="ts">
	import {
		Button,
		Checkbox,
		Icon,
		Pill,
		Progress,
		Select,
		Surface,
		Switch,
		TextInput,
		Theme
	} from 'bref-ui-themes/glassy';
	import GlassCalendar from './glass-calendar.svelte';
	let { time }: { time: number } = $props();
	let playing = $state(true);
	let focused = $state(false);
	let done = $state(false);
	let workspace = $state('personal');
	const phase = $derived(Math.floor(time / 3));
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
		<nav class="glass-nav" aria-label="Daydream">
			<strong>daydream</strong>
			<div>
				<TextInput
					placeholder="Search your space…"
					icon={{ name: 'search' }}
					aria-label="Search your space"
				/>
				<label class="sr-only" for="glass-workspace">Workspace</label>
				<Select
					items={[
						{ id: 'personal', label: 'Personal space' },
						{ id: 'studio', label: 'Design studio' }
					]}
					bind:value={workspace}
					id="glass-workspace"
				/><Button icon={{ name: 'notifications' }} glass rounded aria-label="Notifications" />
				<span class="glass-avatar">AM</span>
			</div>
		</nav>
		<div class="glass-greeting">
			<div>
				<p>THURSDAY, OCTOBER 22</p>
				<h2>A little room to focus.</h2>
			</div>
			<Pill label="18° · Mostly sunny" icon={{ name: 'partly_cloudy_day' }} glass />
		</div>
		<div class="glass-widgets">
			<Surface glass variant="soft" radius="large" spacing="large" class="music-widget">
				<div class="widget-heading">YOUR DAILY SOUNDTRACK <Icon name="graphic_eq" /></div>
				<div class="record" style:transform={`rotate(${playing ? time * 12 : 22}deg)`}>
					<div>✳</div>
				</div>
				<h3>Somewhere softer</h3>
				<p>Low tide · Morning sessions</p>
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
					<div class="widget-heading">
						<h3>Deep focus</h3>
						<Icon name="blur_on" />
					</div>
					<label><Switch bind:checked={focused} />Do not disturb</label>
					<p>{focused ? 'A little quiet. All yours.' : 'Make space for the good work.'}</p>
				</Surface><Surface glass variant="soft" radius="large" spacing="large" class="todo-widget">
					<div class="widget-heading">
						<h3>Small wins</h3>
						<Pill label={done ? '3 / 3' : '2 / 3'} glass size="small" />
					</div>
					<label>
						<Checkbox bind:checked={done} />
						<span class:checked={done}>Make something lovely</span>
					</label>
					<label><Checkbox checked />Go outside</label>
					<label><Checkbox checked />Clear the desk</label>
					<Progress value={done ? 1 : 2 / 3} label="Tasks completed" />
				</Surface>
			</div>
			<GlassCalendar {time} />
		</div>
	</div>
</Theme>
