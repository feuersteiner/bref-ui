<script lang="ts">
	import { clickPulse, motion, type Keyframe } from '../motion.js';
	let {
		time,
		path,
		clicks = [],
		visible = true
	}: {
		time: number;
		path: readonly Keyframe[];
		clicks?: readonly number[];
		visible?: boolean;
	} = $props();
	const point = $derived(motion(time, path));
	const pulse = $derived(clickPulse(time, clicks));
</script>

{#if visible}<div
		class="film-cursor"
		aria-hidden="true"
		style:transform={`translate(${point.x}px, ${point.y}px) scale(${pulse < 1 ? 0.9 + pulse * 0.1 : 1})`}
	>
		<svg viewBox="0 0 24 30" width="24" height="30">
			<path
				d="M3 2.5v23l6-6 4.2 8.5 4-2-4.2-8.3h8Z"
				fill="#171717"
				stroke="#fff"
				stroke-width="1.5"
				stroke-linejoin="round"
			/>
		</svg>
	</div>{/if}
