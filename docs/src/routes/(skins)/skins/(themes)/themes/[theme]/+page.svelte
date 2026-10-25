<script lang="ts">
	import { resolve } from '$app/paths';
	import * as components from 'bref-ui';
	import type { TabItemDataProps } from 'bref-ui/types';
	import { prefersReducedMotion } from 'svelte/motion';
	import { fade } from 'svelte/transition';
	import type { PageProps } from './$types.js';
	let { data }: PageProps = $props();
	const name = $derived(data.theme[0].toUpperCase() + data.theme.slice(1));
	let checked = $state(true);
	let open = $state(false);
	let value = $state('');
	let choice = $state<string | string[]>('one');
	let projectTab = $state('overview');
	let stageTab = $state('design');
	let settingsTab = $state('members');
	const projectTabs = [
		{ id: 'overview', label: 'Project overview', icon: 'dashboard' },
		{ id: 'activity', label: 'Recent activity', icon: 'history' },
		{ id: 'files', label: 'Project files', icon: 'folder' },
		{ id: 'analytics', label: 'Analytics', icon: 'monitoring', disabled: true }
	] as const satisfies readonly TabItemDataProps[];
	const stageTabs = [
		{ id: 'design', label: 'Design', icon: 'draw' },
		{ id: 'build', label: 'Build', icon: 'construction' },
		{ id: 'launch', label: 'Launch', icon: 'rocket_launch' }
	] as const satisfies readonly TabItemDataProps[];
	const settingsTabs = [
		{ id: 'members', label: 'Members', icon: 'group' },
		{ id: 'notifications', label: 'Notifications', icon: 'notifications' },
		{ id: 'security', label: 'Security', icon: 'lock' }
	] as const satisfies readonly TabItemDataProps[];
	const indicatorFade = (node: HTMLElement) =>
		fade(node, { duration: prefersReducedMotion.current ? 0 : 160 });
</script>

<svelte:head>
	<title>{name} palette | Bref</title>
	<meta name="description" content={`Try the ${name} palette with canonical Bref components.`} />
</svelte:head>

<div data-theme-gallery>
	<nav aria-label="Palette demonstrations">
		<a href={resolve('/(skins)/skins')}>← Showcase</a>
		<div>
			{#each ['relay', 'forma', 'elsewhere'] as theme (theme)}<a
					href={resolve('/(skins)/skins/(themes)/themes/[theme]', { theme })}
					aria-current={data.theme === theme ? 'page' : undefined}
				>
					{theme[0].toUpperCase() + theme.slice(1)}
				</a>{/each}
		</div>
	</nav>
	<main id="theme-content" tabindex="-1">
		<h1>{name}</h1>
		<p data-muted>
			A palette applied to canonical Bref components. The complete site demo uses this same palette.
		</p>
		<p>
			<code>import &#123; Theme, Button, Tabs &#125; from 'bref-ui';</code>
		</p>
		<section aria-labelledby="tabs">
			<h2 id="tabs">Tabs</h2>
			<p data-muted>Use arrow keys, Home and End to switch views. Analytics is disabled.</p>
			<div data-tab-example>
				<h3>Horizontal · fit · small</h3>
				<components.Tabs
					items={projectTabs}
					size="small"
					bind:value={projectTab}
					label="Project views"
				/>
				<div
					data-tab-panel
					role="tabpanel"
					aria-label={projectTabs.find((tab) => tab.id === projectTab)?.label}
					tabindex="0"
				>
					{#if projectTab === 'overview'}
						<h3>Website refresh</h3>
						<p>8 tasks open · 3 completed. The next review is Thursday.</p>
					{:else if projectTab === 'activity'}
						<h3>Recent activity</h3>
						<p>Maya completed the navigation review. Jules uploaded the new homepage draft.</p>
					{:else}
						<h3>Project files</h3>
						<ul>
							<li>Homepage draft.fig</li>
							<li>Content checklist.pdf</li>
						</ul>
					{/if}
				</div>
			</div>
			<div data-tab-example>
				<h3>Horizontal · fill · filled icons</h3>
				<components.Tabs
					items={stageTabs}
					bind:value={stageTab}
					label="Project stages"
					width="fill"
					filled
					transitionIn={indicatorFade}
					transitionOut={indicatorFade}
				/>
				<div
					data-tab-panel
					role="tabpanel"
					aria-label={stageTabs.find((tab) => tab.id === stageTab)?.label}
					tabindex="0"
				>
					{#if stageTab === 'design'}<h3>Shape the experience</h3>
						<p>Review the layout and approve the visual direction.</p>
					{:else if stageTab === 'build'}<h3>Make it work</h3>
						<p>Connect the approved screens and check keyboard access.</p>
					{:else}<h3>Ready to share</h3>
						<p>Complete the release checklist and publish the finished project.</p>{/if}
				</div>
			</div>
			<div data-tab-example>
				<h3>Vertical · large</h3>
				<div data-vertical-tabs>
					<components.Tabs
						items={settingsTabs}
						bind:value={settingsTab}
						label="Project settings"
						orientation="vertical"
						size="large"
					/>
					<div
						data-tab-panel
						role="tabpanel"
						aria-label={settingsTabs.find((tab) => tab.id === settingsTab)?.label}
						tabindex="0"
					>
						{#if settingsTab === 'members'}<h3>Project members</h3>
							<p>Maya, Jules and Sam have access to this project.</p>
						{:else if settingsTab === 'notifications'}<h3>Stay up to date</h3>
							<p>Task assignments and review requests appear in the activity feed.</p>
						{:else}<h3>Secure access</h3>
							<p>Only invited members can view project files.</p>{/if}
					</div>
				</div>
			</div>
		</section>
		<section aria-labelledby="buttons">
			<h2 id="buttons">Buttons</h2>
			{#each ['neutral', 'soft', 'filled'] as variant (variant)}<div data-actions>
					<span>{variant}</span>
					{#each ['small', 'medium', 'large'] as size (size)}<components.Button
							label={size}
							variant={variant as 'neutral' | 'soft' | 'filled'}
							size={size as 'small' | 'medium' | 'large'}
							color="primary"
						/>{/each}
				</div>{/each}
			<div data-actions>
				<components.Button label="Disabled" disabled /><components.Button
					label="Open dialog"
					variant="filled"
					color="primary"
					onClick={() => (open = true)}
				/>
			</div>
		</section>
		<section aria-labelledby="controls">
			<h2 id="controls">Native controls</h2>
			<div data-form>
				<label>
					<span>Project name</span>
					<components.TextInput bind:value placeholder="A new project" />
				</label>
				<label>
					<span>Project</span>
					<components.Select
						items={[
							{ id: 'one', label: 'First project' },
							{ id: 'two', label: 'Second project' }
						]}
						bind:value={choice}
					/>
				</label>
				<label data-checkbox-label>
					<components.Checkbox bind:checked />
					<span>Ready for review</span>
				</label>
				<label data-checkbox-label>
					<components.Checkbox disabled checked />
					<span>Disabled checkbox</span>
				</label>
			</div>
		</section>
		<section aria-labelledby="feedback">
			<h2 id="feedback">Feedback & surfaces</h2>
			<div data-actions>
				<components.Pill label="In progress" color="primary" /><components.Pill
					label="Ready"
					color="success"
				/><components.Spinner label="Loading example" />
			</div>
			<components.Progress value={0.65} aria-label="Project progress" /><components.Surface
				variant="soft"
				radius="medium"
				spacing="large"
			>
				<p>Theme colors, native CSS and reusable components.</p>
			</components.Surface>
		</section>
	</main>
	<components.Dialog
		bind:open
		header={{
			title: 'Review project',
			icon: { name: 'task_alt' },
			description: 'Try Tab, Shift+Tab and Escape.'
		}}
		footer={{
			primary: { label: 'Done', onClick: () => (open = false) },
			secondary: { label: 'Cancel', onClick: () => (open = false) }
		}}
	>
		<p>Keyboard focus stays in this dialog and returns to the trigger when it closes.</p>
	</components.Dialog>
</div>

<style>
	[data-theme-gallery] {
		max-width: 1040px;
		padding: 24px;
		margin: auto;
	}
	main {
		scroll-margin-block-start: 180px;
	}
	nav {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 20px;
		padding-bottom: 24px;
		border-bottom: 1px solid color-mix(in srgb, var(--color-foreground) 15%, transparent);
	}
	nav div {
		display: flex;
		gap: 20px;
	}
	a {
		color: inherit;
	}
	a[aria-current] {
		font-weight: 600;
	}
	h1 {
		font-size: 48px;
		margin: 40px 0 16px;
	}
	code {
		overflow-wrap: anywhere;
	}
	section {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 24px;
		margin-top: 48px;
	}
	h2 {
		font-size: 24px;
	}
	[data-actions] > span {
		min-width: 60px;
	}
	[data-tab-example] {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 16px;
		min-width: 0;
	}
	h3 {
		font-size: 16px;
	}
	[data-tab-panel] {
		min-width: 0;
		padding: 20px;
		border: 1px solid color-mix(in srgb, var(--color-foreground) 12%, transparent);
		border-radius: 12px;
	}
	[data-tab-panel] p,
	[data-tab-panel] ul {
		margin-top: 12px;
	}
	[data-tab-panel] ul {
		padding-inline-start: 20px;
	}
	[data-vertical-tabs] {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		gap: 20px;
		align-items: start;
	}
	[data-form] {
		max-width: 400px;
	}
	label[data-checkbox-label] {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	@media (max-width: 500px) {
		[data-theme-gallery] {
			padding: 20px;
		}
		nav {
			gap: 16px;
		}
		nav div {
			gap: 14px;
		}
	}
</style>
