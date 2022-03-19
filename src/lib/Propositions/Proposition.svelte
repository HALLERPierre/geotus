<script lang="ts">
	import Direction from './Direction.svelte';

	export let country: string;
	export let distance: number;
	export let direction: string | undefined = undefined;
	export let correct: boolean;
</script>

<span>{country}</span>
<div>
	<span>{distance}m</span>
	<span>
		{#if correct}
			✓
		{:else}
			<Direction {direction} />
		{/if}
	</span>
</div>
