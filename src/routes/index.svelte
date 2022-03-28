<script lang="ts">
	import { countries } from './_data/countries/names';
	import Autocomplete from '../lib/Autocomplete/Autocomplete.svelte';
	import Checkmark from '../lib/Checkmark.svelte';
	import Propositions from '../lib/Propositions/Propositions.svelte';
	import type { DirectionEnum } from '../lib/Propositions/types';
	import Score from '../lib/Score.svelte';
	import type { Context } from './_stateMachine';

	type Answer = { country: string; distance: number; correct: boolean; direction?: DirectionEnum };

	export let context: Context | null = null;

	const countriesName = countries.map((country) => country.name);

	let answer: string = '';
	let wrongAnswers: Array<Answer> = [];
	let showCorrect = false;

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		const body = new FormData();

		body.append('answer', countries.find((country) => country.name === answer).code);
		body.append('context', JSON.stringify(context));

		const res = await fetch('', {
			method: 'POST',
			headers: {
				accept: 'application/json'
			},
			body
		});

		const data = await res.json();

		if (data.correct) {
			wrongAnswers = [];
			showCorrect = true;
			setTimeout(() => (showCorrect = false), 500);
		} else {
			wrongAnswers = [
				...wrongAnswers,
				{
					country: answer,
					distance: data.distance ?? 0,
					correct: data.correct,
					direction: data.direction
				}
			];
		}
		context = data.context;
		answer = '';
	}
</script>

<div class="container">
	<div class="left">
		<Score previous={context?.previous} score={context?.score} />
	</div>
	<div class="center">
		<Checkmark show={showCorrect} />
		<div class="image">
			{@html context?.country.svg}
		</div>
		<form class="answer" action="/geotus" method="post" on:submit={handleSubmit}>
			<Autocomplete countries={countriesName} bind:inputValue={answer} />
		</form>
		<Propositions answers={wrongAnswers} />
	</div>
	<div class="right" />
</div>

<style>
	.container {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.container > div {
		width: 33%;
	}

	.left {
		max-height: 1000px;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		margin-top: 100px;
	}

	.center {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.image {
		width: 500px;
	}

	.answer :global(.country-input) {
		width: 100%;
	}

	:global(path) {
		fill: #202020;
	}
</style>
