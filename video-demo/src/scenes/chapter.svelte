<script lang="ts">
	import Kinetic from '../components/kinetic.svelte';
	let { chapter, time }: { chapter: number; time: number } = $props();
	const titles = [
		'Import the components.',
		'Own the code.',
		'Lazy?\nWe made the themes for you ;)'
	];
</script>

<div class="type-screen chapter-title">
	<Kinetic text={titles[chapter - 1]} {time} speed={40} leave={chapter === 3 ? 3.6 : 2.15} />
</div>
