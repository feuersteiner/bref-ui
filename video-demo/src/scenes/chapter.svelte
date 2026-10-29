<script lang="ts">
	let { chapter, time }: { chapter: number; time: number } = $props();
	const titles = ['Import and use', 'Own the code.', 'Start with a theme.'];
	const endings = ['the components.', 'Make it yours.', 'Make it yours.'];
	const captions = [
		'One install. A thousand starting points.',
		'Copy the source. Keep the freedom.',
		'Three personalities. The same Bref foundation.'
	];
</script>

<div class="title-screen chapter-title">
	<p class="eyebrow">
		THE BREF WAY <span>—</span>
		0{chapter}
	</p>
	<div class="giant-number" style:transform={`translateY(${time * -8}px)`}>#{chapter}</div>
	<h1>
		{titles[chapter - 1]}
		<br />
		<em>{endings[chapter - 1]}</em>
	</h1>
	<p class="chapter-caption">{captions[chapter - 1]}</p>
</div>
