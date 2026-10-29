<script lang="ts">
	import Icon from '../../icon/icon.svelte';
	import type { TreeNodeContentProps } from 'bref-ui/types';

	let { item, ...attributes }: TreeNodeContentProps = $props();
</script>

<button {...attributes} type="button" disabled={item.disabled}>
	{#if item.icon}
		<Icon {...item.icon} label={undefined} />
	{/if}
	<span data-label>{item.label}</span>
</button>

<style>
	button {
		display: flex;
		align-items: center;
		justify-content: start;
		flex: 1;
		gap: 6px;
		min-width: 0;
		height: var(--tree-height);
		padding: 0;
		border: 0;
		border-radius: 0;
		outline: none;
		background: transparent;
		color: inherit;
		font: inherit;
		text-align: start;
		cursor: pointer;
	}
	button > :global([aria-hidden]) {
		font-size: 16px;
	}
	span[data-label] {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	button::before {
		position: absolute;
		inset: 0;
		border-radius: inherit;
		content: '';
	}
	button:focus-visible::before {
		outline: 1px solid var(--color-primary);
		outline-offset: -1px;
	}
	button:disabled {
		color: var(--color-muted);
		cursor: default;
	}
	@media (forced-colors: active) {
		button:disabled {
			color: GrayText;
		}
		button:focus-visible::before {
			outline-color: Highlight;
		}
	}
</style>
