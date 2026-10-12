<script lang="ts">
	import { asset, resolve } from '$app/paths';
	import { Icon } from '$lib/index.js';
</script>

<div data-live-demos>
	<a href={resolve('/relay')} data-relay-preview>
		<div data-preview>
			<span>Relay</span>
			<div>
				<i></i>
				<i></i>
				<i></i>
			</div>
		</div>
		<h3>Relay <Icon name="arrow_outward" /></h3>
		<p>A project workspace. Complete, organize and edit tasks.</p>
	</a>
	<a href={resolve('/forma')}>
		<img
			src={asset('/demos/forma-room.jpg')}
			alt="Forma’s warm, considered furniture collection"
			width="600"
			height="400"
			loading="lazy"
		/>
		<h3>Forma <Icon name="arrow_outward" /></h3>
		<p>A furniture shop. Browse the catalog and manage your cart.</p>
	</a>
	<a href={resolve('/elsewhere')}>
		<div data-preview data-ai-preview>
			<span><Icon name="auto_awesome" />Elsewhere</span>
			<div>
				<i></i>
				<i></i>
				<i></i>
			</div>
		</div>
		<h3>Elsewhere <Icon name="arrow_outward" /></h3>
		<p>An agent workspace. Run a sample website audit and review its findings.</p>
	</a>
</div>

<style>
	[data-live-demos] {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 24px;
	}
	a {
		display: block;
		text-decoration: none;
		color: var(--color-foreground);
	}
	a:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 6px;
		border-radius: 4px;
	}
	img,
	[data-preview] {
		width: 100%;
		height: 172px;
		object-fit: cover;
		border-radius: 8px;
	}
	[data-preview] {
		background: #edf2f9;
		color: #263346;
		padding: 20px;
	}
	[data-preview] > span {
		font:
			600 24px/1.2 'Inter Variable',
			sans-serif;
		letter-spacing: -0.05em;
	}
	[data-preview] > div {
		display: grid;
		gap: 8px;
		padding-block: 14px;
	}
	i {
		display: block;
		height: 10px;
		width: 86%;
		border-radius: 3px;
		background: #fff;
		border-left: 8px solid #375b86;
	}
	i:nth-child(2) {
		width: 72%;
	}
	i:nth-child(3) {
		width: 80%;
	}
	[data-ai-preview] {
		background: #f0edf8;
		color: #534274;
	}
	[data-ai-preview] > span {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	[data-ai-preview] i {
		border-left-color: #79659d;
	}

	h3 {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 22px;
		margin-top: 16px;
	}
	p {
		color: var(--color-muted);
		font-size: 13px;
		line-height: 1.6;
		margin-top: 8px;
	}
	@media (max-width: 600px) {
		[data-live-demos] {
			grid-template-columns: 1fr;
		}
		img,
		[data-preview] {
			height: 220px;
		}
	}
</style>
