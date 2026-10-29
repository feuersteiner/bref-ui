export const componentSource = (local = false) => `<script lang="ts">
  import { Button, Switch, Theme } from '${local ? '#bref' : 'bref-ui'}';
  let enabled = $state(true);
  let saved = $state(false);
</script>

<Theme />
<section>
  <h2>Stay in the loop.</h2>
  <p>Good ideas deserve a little space.</p>
  <label>
    <Switch bind:checked={enabled} />
    Keep me inspired
  </label>
  <Button
    label={saved ? "You're in!" : 'Count me in'}
    variant="filled"
    color="primary"
    onClick={() => saved = !saved}
  />
</section>`;

export const paletteSource = (color: string) => `<script lang="ts">
  import { Theme } from 'bref-ui';
</script>

<Theme palette={{
  primary: '${color}'
}} />

<!-- Your palette. Every component. -->`;

export const modeSource = (dark: boolean) => `<script lang="ts">
  import { ThemeModeToggle } from 'bref-ui';
</script>

<ThemeModeToggle mode="${dark ? 'dark' : 'light'}" />

<!-- Same components. Both modes. -->`;

export const tokenize = (source: string) =>
	source
		.split(
			/("[^"\n]*"|'[^'\n]*'|\b(?:import|from|let|true|false)\b|<\/?[\w]+|\$state|#[\da-fA-F]{6}|\/?>)/g
		)
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
