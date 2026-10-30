export default {
	props:
		"header: DialogHeaderDataProps; children: Snippet; open?: boolean = false; footer?: Snippet | { primary: DialogActionProps; secondary: DialogActionProps }; dismissible?: boolean = true; glass?: boolean = true; closeOnBackdrop?: boolean = false; size?: Size | 'full-screen' = medium",
	purpose: 'Present modal content or forms with title/icon entrances that respect reduced motion.',
	setup: 'let open = $state(false);',
	example:
		'<button onclick={() => open = true}>Open</button>\n<Dialog bind:open header={{ title: "Details" }}>Content</Dialog>'
};
