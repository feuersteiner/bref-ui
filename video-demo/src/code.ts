export const componentSource = (local = false) => `<script lang="ts">
  import { Theme, Icon, TextInput,
    Switch, Checkbox, Button } from '${local ? '#bref' : 'bref-ui'}';
  let email = $state('');
  let updates = $state(true);
  let consent = $state(true);
  let saved = $state(false);
</script>

<Theme />
<Icon name="auto_awesome" color="primary" />
<h2>Create a workspace.</h2>
<label for="name">Name</label>
<TextInput id="name" value="Alex Morgan" />
<label for="email">Email</label>
<TextInput id="email" bind:value={email}
  icon={{ name: 'mail' }} />
<label><Switch bind:checked={updates} />
  Product updates</label>
<label><Checkbox bind:checked={consent} />
  I agree to the terms</label>
<Button label={saved ? 'Workspace created' : 'Create workspace'}
  icon={{ name: saved ? 'check' : 'add' }}
  color="primary" variant="filled"
  onClick={() => saved = true} />`;
export const paletteSource = (primary: string, background: string) => `<Theme palette={{
  primary: '${primary}',
  background: '${background}'
}} />`;
export const modeSource = (dark: boolean) =>
	`<ThemeModeToggle mode="${dark ? 'dark' : 'light'}" />`;
export const tokenize = (source: string) =>
	source
		.split(/("[^"\n]*"|'[^'\n]*'|\b(?:import|from|let|true|false)\b|<\/?[\w]+|\$state|\/?>)/g)
		.filter(Boolean)
		.map((text) => ({
			text,
			kind: /^["']/.test(text)
				? 'string'
				: /^(<|\/?>)/.test(text)
					? 'tag'
					: /^(import|from|let|true|false|\$state)$/.test(text)
						? 'keyword'
						: 'plain'
		}));
