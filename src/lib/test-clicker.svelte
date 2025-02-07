<script lang="ts">
	let count = $state(0);
	const onclick = () => {
		count++;
	};
</script>

<button {onclick}> Click Me</button>
<p>Clicked {count} times</p>
