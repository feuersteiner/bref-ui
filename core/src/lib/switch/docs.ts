import type { ComponentDocProps } from '../types/docs.js';

export default {
	description: 'A checkbox-based on/off control with native form behavior.',
	usage: `\`\`\`svelte
<script>
  import { Icon, Switch } from 'bref-ui';
  let enabled = $state(false);
</script>

<label>
  <Switch name="notifications" bind:checked={enabled}>
    {#if enabled}<Icon name="dark_mode" />{:else}<Icon name="light_mode" />{/if}
  </Switch>
  Notifications
</label>
\`\`\`

Use a visible label for the native checkbox. Bind checked for state; name, required, disabled and native events retain form semantics. Children are an optional decorative snippet; keep the control accessible independently of its icon. Customize with scoped CSS and existing theme tokens.`,
	props: [
		{
			name: 'checked',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Bindable on/off state.',
			bindable: true
		},
		{
			name: 'size',
			type: 'BaseSize',
			required: false,
			default: 'medium',
			description: 'small, medium or large.'
		},
		{
			name: 'children',
			type: 'Snippet',
			required: false,
			default: 'Omitted',
			description: 'Decorative content rendered inside the thumb.'
		}
	]
} satisfies ComponentDocProps;
