export default {
	purpose:
		'Use for fully rounded primary-colored floating-pill tabs with soft glass selection, required icons and consumer-owned content. Glass respects reduced transparency and contrast preferences. Horizontal fit scrolls and fill truncates; equal-width vertical pills truncate and scroll vertically. Small screens show only the selected horizontal label and hide all vertical labels.',
	setup: 'let value = $state("overview");',
	example:
		'<Tabs items={[{ id: "overview", label: "Overview", icon: "dashboard" }, { id: "settings", label: "Settings", icon: "settings" }]} bind:value label="Workspace sections" />',
	props:
		'items: readonly TabItemDataProps[] ({ id: string; label: string; icon: IconName; disabled?: boolean = false }); orientation?: horizontal = horizontal with size?: Dimension = fit (fit | fill), or orientation: vertical with size?: never; value?: string = undefined (bindable; omitted preserves native Tab order); onChange?: (id: string) => void; label?: string = Tabs; filled?: boolean = false (fills every icon; selected icon is always filled); transitionIn?: TabTransition = shared crossfade; transitionOut?: TabTransition = shared crossfade (TabTransition: (node: HTMLElement) => TransitionConfig | (() => TransitionConfig))'
};
