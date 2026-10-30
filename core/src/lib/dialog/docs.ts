import type { ComponentDocProps } from '../types/docs.js';

export default {
	description: 'Present modal content with native focus and accessible naming.',
	usage: `\`\`\`svelte
<script lang="ts">
  import { Button, Dialog, TextInput } from 'bref-ui';
  let open = $state(false);
</script>

<Button label="Open dialog" onClick={() => open = true} />
<Dialog bind:open header={{ title: 'Edit details', description: 'Changes are local until saved.' }}>
  <label>
    Display name <TextInput value="Example name" />
  </label>
</Dialog>
\`\`\`

Bind open to show or dismiss the native modal dialog. header.title names the dialog and header.description describes it. Children supply body content; footer accepts a snippet or primary/secondary actions. The modal manages focus, traps keyboard navigation and restores focus on close. dismissible controls Escape and the close button. Native dialog attributes/events are forwarded except managed open/children/naming props. Customize size and theme tokens.`,
	props: [
		{
			name: 'header',
			type: 'DialogHeaderDataProps',
			required: true,
			default: '—',
			description:
				'Title, optional description, and optional decorative icon. Title/icon changes animate unless reduced motion is requested.'
		},
		{
			name: 'children',
			type: 'Snippet',
			required: true,
			default: '—',
			description: 'Dialog body.'
		},
		{
			name: 'open',
			type: 'boolean',
			required: false,
			default: 'false',
			description: 'Bindable modal state.',
			bindable: true
		},
		{
			name: 'footer',
			type: 'Snippet | { primary: DialogActionProps; secondary: DialogActionProps }',
			required: false,
			default: 'Omitted',
			description:
				'Custom footer or exactly two actions; each action accepts label, icon, onClick, disabled, and status color.'
		},
		{
			name: 'dismissible',
			type: 'boolean',
			required: false,
			default: 'true',
			description: 'Allow Escape and show the close button.'
		},
		{
			name: 'size',
			type: "Size | 'full-screen'",
			required: false,
			default: 'medium',
			description: 'Dialog width or full-screen; screens up to 36rem always use full-screen.'
		}
	]
} satisfies ComponentDocProps;
