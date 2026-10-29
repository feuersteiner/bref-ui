<script lang="ts">
	import Paris from '../showcases/paris.svelte';
	import Code from '../showcases/code.svelte';
	import Glass from '../showcases/glass.svelte';
	import Cursor from '../components/cursor.svelte';
	import Kinetic from '../components/kinetic.svelte';
	import { camera, type Keyframe } from '../motion.js';
	let { id, time }: { id: string; time: number } = $props();
	const intro = $derived(id === 'paris' ? 0 : 3.2);
	const local = $derived(Math.max(0, time - intro));
	// One restrained close-up per theme. Establish, ease in, hold for the interactions, ease out.
	const tracks: Record<string, readonly Keyframe[]> = {
		paris: [
			[0, 960, 540, 1],
			[22, 960, 540, 1]
		],
		vscode: [
			[0, 960, 540, 1],
			[5.5, 960, 540, 1],
			[7.5, 1550, 480, 1.18],
			[14.5, 1550, 480, 1.18],
			[16.5, 960, 540, 1]
		],
		glassy: [
			[0, 960, 540, 1],
			[6, 960, 540, 1],
			[8, 1310, 550, 1.16],
			[14.5, 1310, 550, 1.16],
			[16.5, 960, 540, 1]
		]
	};
	const paths: Record<string, readonly Keyframe[]> = {
		paris: [
			[0, 1800, 950],
			[9, 1800, 950],
			[12.2, 1410, 694],
			[15, 1410, 694],
			[15.7, 1115, 775],
			[17, 1115, 775],
			[17.5, 1393, 921],
			[22, 1393, 921]
		],
		vscode: [
			[0, 1750, 950],
			[2.8, 1750, 950],
			[4, 470, 75],
			[6.5, 470, 75],
			[7.5, 1480, 386],
			[9, 1480, 386],
			[10.3, 1671, 309],
			[11.8, 1671, 309],
			[12.5, 1671, 356],
			[14.5, 1671, 356],
			[15.5, 1671, 612],
			[17, 1671, 612]
		],
		glassy: [
			[0, 1750, 950],
			[2.8, 1750, 950],
			[4, 1045, 801],
			[7, 1045, 801],
			[8.5, 1373, 372],
			[12, 1373, 372],
			[13.5, 1361, 692],
			[17, 1361, 692]
		]
	};
	const title = $derived(
		id === 'vscode'
			? 'Fancy building a devtool?\nWe got you.'
			: 'Your next SaaS side project?\nGlassy is here.'
	);
</script>

<div class={['theme-sequence', id]}>
	<div class="theme-live">
		<div class="theme-camera" style:transform={camera(local, tracks[id])}>
			{#if id === 'paris'}<Paris time={local} />{:else if id === 'vscode'}<Code
					time={local}
				/>{:else}<Glass time={local} />{/if}
			{#if id !== 'paris'}<Cursor
					time={local}
					path={paths[id]}
					clicks={id === 'vscode' ? [4.5, 8, 10.8, 13, 16] : [4.5, 9, 14]}
				/>{/if}
		</div>
	</div>
	{#if id === 'paris'}<Cursor
			time={local}
			path={paths.paris}
			clicks={[12.7, 16.2, 18]}
			visible={local >= 9}
		/>{/if}
	{#if intro && time < intro}<div class="type-screen theme-announcement">
			<Kinetic text={title} {time} speed={30} leave={2.85} />
		</div>{/if}
</div>
