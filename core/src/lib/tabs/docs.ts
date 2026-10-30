import type { ComponentDocProps } from '../types/docs.js';

export default {
	description:
		'Switch between sections with primary-colored floating pills and soft glass selection, horizontally or vertically.',
	usage: `\`\`\`svelte
<script lang="ts">
  import { Tabs } from 'bref-ui';
  let value = $state('overview');
  const items = [
  {
    "id": "overview",
    "label": "Overview",
    "icon": "dashboard"
  },
  {
    "id": "activity",
    "label": "Activity",
    "icon": "history"
  },
  {
    "id": "archived",
    "label": "Archived",
    "icon": "archive",
    "disabled": true
  },
  {
    "id": "settings",
    "label": "Settings",
    "icon": "settings"
  }
] as const;
</script>

<Tabs {items} bind:value orientation="horizontal" label="Workspace sections" />
{#if value === 'overview'}
  <p>Workspace overview</p>
{:else}
  <p>Workspace settings</p>
{/if}
\`\`\`

\`\`\`svelte
<script lang="ts">
  import { Tabs } from 'bref-ui';
  let value = $state('overview');
  const items = [
  {
    "id": "overview",
    "label": "Overview",
    "icon": "dashboard"
  },
  {
    "id": "activity",
    "label": "Activity",
    "icon": "history"
  },
  {
    "id": "archived",
    "label": "Archived",
    "icon": "archive",
    "disabled": true
  },
  {
    "id": "settings",
    "label": "Settings",
    "icon": "settings"
  }
] as const;
</script>

<Tabs {items} bind:value orientation="vertical" label="Workspace sections" />
{#if value === 'overview'}
  <p>Workspace overview</p>
{:else}
  <p>Workspace settings</p>
{/if}
\`\`\`

Items require unique IDs, labels and icon names. Bind value to the selected ID and render the associated content in the consumer. Omitted value preserves native Tab order; an unavailable selection leaves the first enabled tab focusable without changing value. Arrow keys follow orientation; Home/End move to endpoints. Set label for the tab list. width is horizontal-only; vertical rejects it. Customize size, filled and indicator transitions. Labels adapt to narrow screens; glass respects contrast and transparency preferences.`,
	props: [
		{
			name: 'items',
			type: 'readonly TabItemDataProps[]',
			required: true,
			default: '—',
			description:
				'Display order; each item has a unique id, label, icon and optional disabled flag.'
		},
		{
			name: 'orientation',
			type: 'Orientation',
			required: false,
			default: 'horizontal',
			description:
				'Soft glass pills in a horizontal row or equal-width vertical column; determines arrow-key navigation.'
		},
		{
			name: 'width',
			type: 'Dimension',
			required: false,
			default: 'fit',
			description:
				'Horizontal only: fit keeps natural item widths and scrolls; fill spans the parent and truncates labels. Vertical rejects width.'
		},
		{
			name: 'size',
			type: 'BaseSize',
			required: false,
			default: 'medium',
			description:
				'Scales tab height, padding, label and icon in both orientations. Coarse pointers keep 44px touch targets.'
		},
		{
			name: 'value',
			type: 'string',
			required: false,
			default: 'undefined',
			description:
				'Bindable selected ID. If missing or disabled, the first enabled tab stays focusable without changing the value. Omitted values preserve native Tab order.',
			bindable: true
		},
		{
			name: 'onChange',
			type: '(id: string) => void',
			required: false,
			default: 'Omitted',
			description: 'Called once when user interaction changes selection.'
		},
		{
			name: 'label',
			type: 'string',
			required: false,
			default: 'Tabs',
			description: 'Accessible name for the tab list.'
		},
		{
			name: 'filled',
			type: 'boolean',
			required: false,
			default: 'false',
			description:
				'Fill every Material Symbols icon; the selected icon is always filled. Does not change the soft glass background.'
		},
		{
			name: 'transitionIn',
			type: 'TabTransition',
			required: false,
			default: 'Shared crossfade',
			description: 'Custom intro for the selected indicator; receives its HTMLElement.'
		},
		{
			name: 'transitionOut',
			type: 'TabTransition',
			required: false,
			default: 'Shared crossfade',
			description: 'Custom outro for the selected indicator; receives its HTMLElement.'
		}
	]
} satisfies ComponentDocProps;
