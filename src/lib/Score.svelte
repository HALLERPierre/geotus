<script lang="ts">
	import type { Context } from '../routes/_stateMachine';
	import { getCountryNameFromCode } from './country';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { afterUpdate } from 'svelte';

	export let previous: Context['previous'] = [];
	export let score: Context['score'] = 0;

	const tweenedScore = tweened(score, {
		duration: 300,
		interpolate: (a, b) => (t) => {
			return Math.round(a + (b - a) * t);
		},
		easing: cubicOut
	});

	afterUpdate(() => {
		tweenedScore.set(score);
	});
</script>

<span class="score">{$tweenedScore}</span>

<ul>
	{#each previous as guess}
		<li>
			{getCountryNameFromCode(guess.countryName)} in {guess.guesses} guesses
		</li>
	{/each}
</ul>

<style>
	.score {
		font-size: 32px;
	}
</style>
