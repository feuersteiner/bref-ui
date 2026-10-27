<script lang="ts">
	import { asset } from '$app/paths';
	import { Icon, Progress, Surface } from 'bref-ui';
	import { Tween, prefersReducedMotion } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { projectPhotos, type Project } from './tasks.js';
	let {
		project,
		photo,
		projectName,
		completed,
		total
	}: {
		project: string;
		photo: Project['photo'];
		projectName: string;
		completed: number;
		total: number;
	} = $props();
	const progress = Tween.of(() => (total ? completed / total : 0), {
		duration: () => (prefersReducedMotion.current ? 0 : 400),
		easing: cubicOut
	});
	const uid = $props.id();
	const percent = $derived(total ? Math.round((completed / total) * 100) : 0);
</script>

<header data-project-stage data-project={project}>
	<img src={asset(projectPhotos[photo].src)} alt="" width="1600" height="900" />
	<div data-project-caption>
		<h1>{projectName}</h1>
		<div data-project-progress>
			<Surface glass variant="filled" color="background" radius="medium" spacing="medium">
				<p data-project-stat aria-hidden="true">
					<span data-stat-label>
						<Icon name="check_circle" color="primary" filled />
						<span id="{uid}-label">Completed</span>
					</span>
					<strong id="{uid}-count">{completed} of {total}</strong>
					<span data-stat-percent>{percent}%</span>
				</p>
				<Progress
					value={progress.current}
					label="Project completion"
					aria-describedby="{uid}-label {uid}-count"
				/>
			</Surface>
		</div>
	</div>
</header>

<style>
	h1 {
		font-weight: 500;
		line-height: 1.15;
	}
	img {
		display: block;
		max-width: 100%;
	}
	[data-project-stage] {
		position: relative;
		isolation: isolate;
		height: 244px;
		border-radius: 24px;
		overflow: hidden;
		background: #dce5ef;
	}
	[data-project-stage] > img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center 55%;
		z-index: -2;
	}
	[data-project-stage]::after {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		background: linear-gradient(90deg, #18283c99, #18283c0a);
	}
	[data-project-stage][data-project='website'] > img {
		object-position: center 65%;
	}
	[data-project-stage][data-project='website']::after {
		background: linear-gradient(90deg, #27395088, #27395000);
	}
	[data-project-caption] {
		height: 100%;
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 24px;
		padding: 32px;
	}
	[data-project-stage] h1 {
		font:
			450 clamp(30px, 4vw, 44px)/1.1 'Inter Variable',
			sans-serif;
		letter-spacing: -0.05em;
		color: white;
	}
	@container demo (max-width: 650px) {
		[data-project-stage] {
			height: 260px;
			border-radius: 20px;
		}

		[data-project-caption] {
			align-items: start;
			justify-content: end;
			flex-direction: column;
			gap: 20px;
			padding: 24px;
		}

		[data-project-caption] > [data-project-progress] {
			align-self: stretch;
			width: auto;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		* {
			transition-duration: 0ms;
		}
	}
	[data-project-progress] {
		flex-shrink: 0;
		width: clamp(220px, 24vw, 280px);
	}
	[data-project-stat] {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: baseline;
		gap: 6px 12px;
		margin: 0;
		font-variant-numeric: tabular-nums;
	}
	[data-stat-label] {
		grid-column: 1 / -1;
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 13px;
		font-weight: 500;
		color: var(--color-muted);
	}
	[data-project-stat] strong {
		font-size: 24px;
		font-weight: 500;
		line-height: 1;
		letter-spacing: -0.02em;
	}
	[data-stat-percent] {
		font-size: 13px;
		font-weight: 500;
		color: var(--color-muted);
	}
</style>
