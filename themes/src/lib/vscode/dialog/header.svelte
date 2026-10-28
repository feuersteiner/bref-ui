<script lang="ts">
	import Icon from '../icon/icon.svelte';
	import type { DialogHeaderProps } from 'bref-ui/types';

	let { title, description, icon, dismissible, id, onDismiss }: DialogHeaderProps = $props();
</script>

<header>
	<div data-toolbar>
		{#if dismissible}
			<button type="button" aria-label="Close dialog" onclick={onDismiss}>
				<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
					<path d="m4 4 8 8m0-8-8 8" fill="none" stroke="currentColor" />
				</svg>
			</button>
		{/if}
	</div>
	<div data-message-row>
		{#if icon}<div data-icon>
				<Icon {...icon} size="medium" color="primary" label={undefined} />
			</div>{/if}
		<div data-message>
			<h2 id={`${id}-title`}>{title}</h2>
			{#if description}<p id={`${id}-description`}>{description}</p>{/if}
		</div>
	</div>
</header>

<style>
	header {
		min-width: 0;
	}
	[data-toolbar] {
		display: flex;
		justify-content: flex-end;
		height: 20px;
		padding-bottom: 4px;
	}
	button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		padding: 2px;
		border: 0;
		border-radius: 4px;
		background: transparent;
		color: inherit;
		cursor: pointer;
	}
	button:hover {
		background: rgb(255 255 255 / 10%);
	}
	button:focus-visible {
		outline: 1px solid var(--color-primary);
		outline-offset: 1px;
	}
	[data-message-row] {
		display: flex;
		align-items: flex-start;
		padding: 0 8px 0 12px;
	}
	[data-icon] {
		flex: 0 0 24px;
		height: 24px;
	}
	[data-message] {
		flex: 1;
		min-width: 0;
		padding-left: 12px;
		overflow-wrap: anywhere;
	}
	h2 {
		display: flex;
		align-items: center;
		min-height: 22px;
		margin: 0 0 4px;
		font: inherit;
		font-size: 14px;
		font-weight: 600;
		line-height: 22px;
	}
	p {
		margin: 0;
		line-height: 20px;
		white-space: pre-wrap;
	}
	@media (forced-colors: active) {
		button:hover {
			background: Highlight;
			color: HighlightText;
		}
		button:focus-visible {
			outline-color: Highlight;
		}
	}
</style>
