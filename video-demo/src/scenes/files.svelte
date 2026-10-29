<script lang="ts">
	import { Icon } from 'bref-ui';
	import Editor from '../components/editor.svelte';
	import FileIcon from '../components/file-icon.svelte';
	import { smooth } from '../timeline.js';
	let { time }: { time: number } = $props();
	const flight = $derived(smooth((time - 0.65) / 1.8));
	const source = `<script lang="ts">\n  let { checked = $bindable(false),\n    ...attributes } = $props();\n\x3c/script>\n\n<label>\n  <input {...attributes}\n    type="checkbox" role="switch"\n    bind:checked />\n  <span></span>\n</label>`;
</script>

<div class="ownership">
	<div class="npm-source">
		<Icon name="cloud" filled label="npm package cloud" />
		<svg viewBox="0 0 18 7" aria-label="npm" role="img">
			<path
				fill="#cb3837"
				d="M0 0h18v6H9v1H5V6H0V0zm1 5h2V2h1v3h1V1H1v4zm5-4v5h2V5h2V1H6zm2 1h1v2H8V2zm3-1v4h2V2h1v3h1V2h1v3h1V1h-6z"
			/>
		</svg>
		<p>bref-ui</p>
	</div>
	<div class="transfer-track" aria-hidden="true"></div>
	<div class="codebase">
		<header>
			<Icon name="folder_open" filled />
			<h2>src/lib/ui</h2>
			<span>Your codebase</span>
		</header>
		<div class="local-code">
			<aside>
				<FileIcon folder />
				<span>switch</span>
				<div style:opacity={flight}>
					<FileIcon />
					<span>switch.svelte</span>
				</div>
			</aside>
			<div class="copied-source" style:opacity={flight}>
				<Editor {source} filename="switch.svelte" />
			</div>
		</div>
	</div>
	<div
		class="flying-file"
		style:left={`${360 + flight * 790}px`}
		style:top={`${490 - Math.sin(flight * Math.PI) * 180}px`}
		style:opacity={time < 2.65 ? 1 : 0}
	>
		<FileIcon />
		<span>switch.svelte</span>
	</div>
	<div class="owned" style:opacity={smooth((time - 2.6) / 0.3)}>
		<Icon name="check_circle" filled /> Yours to change.
	</div>
</div>

<style>
	.ownership {
		position: absolute;
		inset: 0;
	}
	.npm-source {
		position: absolute;
		left: 130px;
		top: 290px;
		width: 430px;
		text-align: center;
	}
	.npm-source :global(span[aria-label]) {
		font-size: 420px;
		color: #d8e4f1;
	}
	svg {
		position: absolute;
		width: 210px;
		left: 110px;
		top: 205px;
	}
	p {
		font-size: 32px;
	}
	.transfer-track {
		position: absolute;
		left: 530px;
		top: 530px;
		width: 350px;
		border-top: 3px dashed #b0b5bd;
	}
	.codebase {
		position: absolute;
		left: 880px;
		top: 180px;
		width: 960px;
		height: 680px;
		border: 1px solid #d1cec6;
		border-radius: 20px;
		overflow: hidden;
		background: #f9f8f4;
	}
	header {
		display: flex;
		align-items: center;
		gap: 18px;
		padding: 30px;
		border-bottom: 1px solid #d1cec6;
	}
	h2 {
		font-size: 30px;
		font-weight: 500;
	}
	header > span {
		margin-left: auto;
		color: #75756f;
		font-size: 21px;
	}
	.local-code {
		display: grid;
		grid-template-columns: 260px 1fr;
		height: 575px;
	}
	aside {
		padding: 30px 20px;
		background: #eeece5;
		font: 19px monospace;
	}
	aside > span {
		margin-left: 10px;
	}
	aside > div {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 30px 0 0 12px;
		color: #34745a;
	}
	.copied-source {
		padding: 32px;
		font: 21px monospace;
	}

	.flying-file {
		position: absolute;
		display: flex;
		gap: 14px;
		align-items: center;
		padding: 24px 30px;
		border-radius: 12px;
		background: #fff;
		box-shadow: 0 18px 60px #20305025;
		font: 27px monospace;
	}
	.owned {
		position: absolute;
		left: 1110px;
		top: 910px;
		display: flex;
		gap: 16px;
		align-items: center;
		color: #34745a;
		font-size: 32px;
	}
</style>
