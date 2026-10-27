<script lang="ts">
	import { Button, Icon } from 'bref-ui';
	import type { Palette } from 'bref-ui/types';

	let { palette }: { palette?: Palette } = $props();
	const variants = ['neutral', 'soft', 'filled'] as const;
	const noop = () => undefined;
</script>

<div
	data-theme-preview
	data-theme={palette ? 'light' : undefined}
	style:--color-primary={palette?.primary}
	style:--color-secondary={palette?.secondary}
	style:--color-background={palette?.background}
	style:--color-foreground={palette?.foreground}
	style:--color-muted={palette?.muted}
	style:--color-info={palette?.info}
	style:--color-success={palette?.success}
	style:--color-warning={palette?.warning}
	style:--color-error={palette?.error}
>
	<Icon name="check_circle" color="success" label="Complete" size="large" />
	{#each variants as variant (variant)}
		<Button {variant} color="primary" label={variant} onClick={noop} />
	{/each}
	<p>Readable text and semantic colors follow the shared theme.</p>
</div>

<style>
	[data-theme-preview] {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 16px;
	}
	[data-theme-preview] p {
		flex-basis: 100%;
		text-align: center;
	}
	[data-theme-preview][data-theme] {
		padding: 24px;
		background: var(--color-background);
		color: var(--color-foreground);
	}
</style>
