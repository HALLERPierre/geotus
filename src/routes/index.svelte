<script lang="ts">
	import { countries } from '../data/countries/names';
	import Autocomplete from '../lib/Autocomplete/Autocomplete.svelte';
	import Propositions from '../lib/Propositions/Propositions.svelte';

	type Answer = { country: string; distance: number; correct: boolean; direction?: string };

	export let svg: string;
	export let code: string;

	const countriesName = countries.map((country) => country.name);
	let answer: string = '';
	let wrongAnswers: Array<Answer> = [];

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		const body = new FormData();

		body.append('answer', countries.find((country) => country.name === answer).code);
		body.append('code', code);

		const res = await fetch('', {
			method: 'POST',
			headers: {
				accept: 'application/json'
			},
			body
		});

		const data = await res.json();

		wrongAnswers = [
			...wrongAnswers,
			{
				country: answer,
				distance: data.distance ?? 0,
				correct: data.correct,
				direction: data.direction
			}
		];

		answer = '';
	}
</script>

<div class="background" />
<div class="container">
	<div class="image">
		{@html svg}
	</div>

	<Propositions answers={wrongAnswers} />

	<form class="answer" action="/geotus" method="post" on:submit={handleSubmit}>
		<Autocomplete countries={countriesName} bind:inputValue={answer} />
	</form>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100%;
	}

	.image {
		width: 500px;
	}

	.answer :global(.country-input) {
		width: 100%;
	}

	.background {
		opacity: 0.1;
		filter: blur(3px);
		z-index: -1;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		position: fixed;
		height: 100%;
		width: 100%;
		background: url('/worldmap.svg');
		background-position: center;
		background-repeat: no-repeat;
	}

	:global(path) {
		fill: #202020;
	}
</style>
