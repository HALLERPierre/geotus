<script lang="ts">
	import Proposition from './Proposition.svelte';
	import type { DirectionEnum } from './types';

	export let answers: Array<{
		country: string;
		distance: number;
		correct: boolean;
		direction?: DirectionEnum;
	}>;
</script>

<ul class="answers">
	{#each answers as answer}
		<li>
			<Proposition {...answer} />
		</li>
	{/each}
</ul>

<style>
	.answers {
		width: 300px;
		display: flex;
		flex-direction: column;
		list-style: none;
		margin: 0;
		padding: 2em;
	}

	.answers > li {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
