<script lang="ts">
	import '../app.css';
	import Background from '../lib/Background.svelte';
</script>

<svelte:head>
	<title>Geotus</title>
</svelte:head>

<main>
	<Background />
	<slot />
</main>

<style>
	main {
		padding: 1rem;
	}
</style>
