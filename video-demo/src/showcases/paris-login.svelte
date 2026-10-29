<script lang="ts">
	import { Button, Checkbox, Icon, TextInput } from 'bref-ui-themes/new-paris';
	import { typeChars } from '../timeline.js';
	let { time }: { time: number } = $props();
	let remembered = $state(true);
	let submitted = $state(false);
	const signedIn = $derived(submitted || time >= 7.2);
</script>

<form
	class="paris-login-form"
	onsubmit={(event) => {
		event.preventDefault();
		submitted = true;
	}}
>
	<Icon name="person" size="large" />
	<h3>Welcome back.</h3>
	<p>Your private atelier. A considered collection.</p>
	<label for="atelier-email">Email address</label>
	<TextInput
		id="atelier-email"
		type="email"
		value={typeChars('alex@atelier.fr', (time - 1.5) / 2.5)}
		placeholder="you@example.com"
		icon={{ name: 'mail' }}
		size="large"
		wide
	/>
	<label for="atelier-password">Password</label>
	<TextInput
		id="atelier-password"
		type="password"
		value={time >= 4.5 ? 'atelier04' : ''}
		placeholder="Enter your password"
		icon={{ name: 'lock' }}
		size="large"
		wide
	/>
	<label class="remember"><Checkbox bind:checked={remembered} />Remember me</label>
	<Button
		type="submit"
		label={signedIn ? 'Signed in' : 'Sign in'}
		icon={{ name: signedIn ? 'check' : 'arrow_forward' }}
		variant="filled"
		color="primary"
		size="large"
		wide
	/>
</form>

<style>
	form {
		width: 650px;
		display: flex;
		flex-direction: column;
		gap: 18px;
	}
	h3 {
		font:
			400 48px 'Times New Roman',
			serif;
		letter-spacing: -2px;
	}
	p {
		color: #777165;
		font-size: 19px;
		margin-bottom: 12px;
	}
	label {
		font-size: 19px;
	}
	.remember {
		display: flex;
		align-items: center;
		gap: 12px;
		margin: 12px 0;
	}
</style>
