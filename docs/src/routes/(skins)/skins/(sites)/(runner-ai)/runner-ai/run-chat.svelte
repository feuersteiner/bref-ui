<script lang="ts">
	import { tick, untrack } from 'svelte';
	import { Button, TextArea } from 'bref-ui';
	import type { Run } from './run-state.svelte.js';
	let {
		run = $bindable(),
		visible = true,
		onSend
	}: { run: Run; visible?: boolean; onSend: () => void } = $props();
	let thread: HTMLDivElement;
	let composer: HTMLFormElement;
	let following = $state(true);
	let unread = $state(false);
	const inputId = $props.id();

	function bottom() {
		thread.scrollTop = thread.scrollHeight;
		following = true;
		unread = false;
	}

	function submit() {
		if (!run.draft.trim()) return;
		following = true;
		onSend();
	}

	$effect(() => {
		const last = run.messages.at(-1)?.id;
		if (!visible || !last) return;
		untrack(() => {
			if (following) tick().then(() => thread && bottom());
			else unread = true;
		});
	});
	$effect(() => {
		const draft = run.draft;
		const input = composer?.querySelector('textarea');
		if (visible && input) {
			input.style.height = draft ? 'auto' : '28px';
			input.style.height = `${Math.min(input.scrollHeight, 132)}px`;
		}
	});
</script>

<section aria-label="Run conversation" data-chat>
	<header>
		<h2>Conversation</h2>
	</header>
	<!-- svelte-ignore a11y_no_noninteractive_tabindex (Scrollable messages need keyboard access.) -->
	<div
		data-thread
		bind:this={thread}
		role="region"
		aria-label="Messages"
		tabindex="0"
		onscroll={() => {
			following = thread.scrollHeight - thread.scrollTop - thread.clientHeight < 48;
			if (following) unread = false;
		}}
	>
		<div role="log" aria-live={visible ? 'polite' : 'off'} aria-relevant="additions">
			{#each run.messages as message (message.id)}
				<article data-role={message.role}>
					<span data-author>{message.role === 'user' ? 'You' : 'RunnerAI'}</span>
					<p>{message.text}</p>
				</article>
			{/each}
		</div>
	</div>
	{#if unread}
		<div data-new-messages><Button label="New messages ↓" size="small" onClick={bottom} /></div>
	{/if}
	<form
		bind:this={composer}
		onsubmit={(event) => {
			event.preventDefault();
			submit();
		}}
	>
		<label for={inputId} data-visually-hidden>Message this run</label>
		<TextArea
			id={inputId}
			bind:value={run.draft}
			placeholder={run.status === 'completed'
				? 'Ask a question or request a revision…'
				: 'Message this run…'}
			rows={1}
			aria-describedby={`${inputId}-hint`}
			maxlength={1000}
			onkeydown={(event) => {
				if (
					event.key === 'Enter' &&
					!event.shiftKey &&
					!event.isComposing &&
					event.keyCode !== 229
				) {
					event.preventDefault();
					submit();
				}
			}}
			wide
			resizable={false}
		/>
		<div data-compose-footer>
			<span id={`${inputId}-hint`}>Shift+Enter for newline</span>
			<Button
				type="submit"
				icon={{ name: 'arrow_upward', label: 'Send message' }}
				size="small"
				variant="filled"
				color="primary"
				rounded
				disabled={!run.draft.trim()}
			/>
		</div>
	</form>
</section>

<style>
	[data-chat] {
		display: flex;
		flex-direction: column;
		min-width: 0;
		min-height: 0;
		position: relative;
		padding: 24px 22px 18px;
		background: var(--run-surface);
		border-left: 1px solid var(--run-rule);
	}
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}
	h2 {
		margin: 0;
		font-size: 14px;
	}
	[data-thread] {
		flex: 1;
		min-height: 120px;
		height: 0;
		overflow-y: auto;
		margin-block: 22px 18px;
		overflow-anchor: none;
		scrollbar-width: thin;
		overscroll-behavior: contain;
	}
	article {
		margin-bottom: 22px;
	}
	[data-author] {
		color: var(--color-foreground);
		font-size: 11px;
		font-weight: 650;
	}
	article p {
		margin: 7px 0 0;
		font-size: 13px;
		line-height: 1.65;
		white-space: pre-line;
		overflow-wrap: anywhere;
	}
	article[data-role='user'] {
		margin-left: 22px;
	}
	article[data-role='user'] p {
		background: var(--run-tint);
		border-radius: 12px;
		padding: 10px 12px;
	}
	form {
		border: 1px solid var(--run-line);
		padding: 12px 12px 8px;
		border-radius: 12px;
		background: var(--run-surface);
	}
	[data-compose-footer] {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 8px;
	}
	[data-compose-footer] > span {
		color: var(--color-muted);
		font-size: 10px;
		visibility: hidden;
	}
	form:focus-within [data-compose-footer] > span {
		visibility: visible;
	}
	[data-new-messages] {
		align-self: center;
		margin: -8px 0 12px;
	}
	@media (max-width: 1100px) {
		[data-chat] {
			padding-inline: 18px;
		}
	}
	@media (max-width: 760px) {
		[data-chat] {
			min-height: 360px;
			height: calc(100dvh - 326px);
			padding-bottom: max(18px, env(safe-area-inset-bottom));
			border-left: 0;
		}
		[data-thread] {
			height: 0;
			max-height: none;
		}
	}
</style>
