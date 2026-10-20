export default {
	purpose:
		'Use for tabs with required icons and consumer-owned content. Horizontal fit scrolls and fill truncates; vertical truncates and scrolls vertically. Small screens show only the selected horizontal label and hide all vertical labels.',
	setup: 'let value = $state("overview");',
	example:
		'<Tabs items={[{ id: "overview", label: "Overview", icon: "dashboard" }, { id: "settings", label: "Settings", icon: "settings" }]} bind:value label="Workspace sections" />',
	props:
		'items: readonly TabItemDataProps[] ({ id: string; label: string; icon: IconName; disabled?: boolean = false }); orientation?: horizontal = horizontal with size?: Dimension = fit (fit | fill), or orientation: vertical with size?: never; value?: string = undefined (bindable; omitted preserves native Tab order); onChange?: (id: string) => void; label?: string = Tabs; filled?: boolean = false; transitionIn?: TabTransition = shared crossfade; transitionOut?: TabTransition = shared crossfade (TabTransition: (node: HTMLElement) => TransitionConfig | (() => TransitionConfig))'
};
