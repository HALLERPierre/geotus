<script lang="ts">
	import Direction from './Direction.svelte';
	import type { DirectionEnum } from './types';

	export let country: string;
	export let distance: number;
	export let direction: DirectionEnum | undefined = undefined;
	export let correct: boolean;
</script>

<span>{country}</span>
<div class="distance">
	<span>{distance}km</span>
	{#if correct}
		✓
	{:else}
		<Direction {direction} />
	{/if}
</div>

<style>
	.distance {
		display: flex;
		align-items: center;
		gap: 0.75em;
	}
</style>
