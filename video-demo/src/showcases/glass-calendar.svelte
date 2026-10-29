<script lang="ts">
	import { Button, Pill, Surface, Tabs } from 'bref-ui-themes/glassy';
	let { time }: { time: number } = $props();
	let view = $state('week');
	let selectedDay = $state(22);
	let joined = $state(false);
	const phase = $derived(Math.floor(time / 3));
	$effect(() => {
		selectedDay = phase >= 4 ? 24 : 22;
		joined = phase >= 5;
	});
</script>

<Surface glass variant="soft" radius="large" spacing="large" class="calendar-widget">
	<div class="widget-heading">
		<h3>A softer schedule</h3>
		<Button icon={{ name: 'more_horiz' }} glass rounded aria-label="Calendar options" />
	</div>
	<Tabs
		items={[
			{ id: 'week', label: 'This week', icon: 'date_range' },
			{ id: 'month', label: 'This month', icon: 'calendar_month' }
		]}
		bind:value={view}
		label="Calendar view"
	/>
	<div class="calendar-days">
		{#each ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as day, index (index)}<button
				class:selected={selectedDay === index + 19}
				onclick={() => (selectedDay = index + 19)}
				aria-label={`October ${index + 19}`}
			>
				<span>{day}</span>
				<strong>{index + 19}</strong>
				<i></i>
			</button>{/each}
	</div>
	<div class="calendar-event">
		<div class="event-time">
			10:30
			<span>11:00</span>
		</div>
		<div>
			<Pill label="DESIGN" color="primary" glass size="small" />
			<h3>Make room for ideas</h3>
			<p>Studio catch-up · 30 min</p>
			<div class="event-people">
				<span>AL</span>
				<span>JN</span>
				<span>+2</span>
			</div>
		</div>
	</div>
	<Button
		label={joined ? 'You’re in' : 'Join the conversation'}
		icon={{ name: joined ? 'check' : 'videocam' }}
		variant="filled"
		color="primary"
		wide
		onClick={() => (joined = !joined)}
	/>
</Surface>
