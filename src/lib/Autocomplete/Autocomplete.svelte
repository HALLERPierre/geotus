<script lang="ts">
	import Country from './Country.svelte';

	export let countries: string[];
	export let inputValue: string;
	/* FILTERING countres DATA BASED ON INPUT */
	let filteredCountries: string[] = [];

	const filterCountries = () => {
		if (inputValue) {
			filteredCountries = countries
				.filter((country) => country.toLowerCase().startsWith(inputValue.toLowerCase()))
				.slice(0, 5);
		}
	};

	$: if (!inputValue) {
		filteredCountries = [];
		hiLiteIndex = null;
	}

	const setInputVal = (countryName: string) => {
		inputValue = removeBold(countryName);
		filteredCountries = [];
		hiLiteIndex = null;
		(document.querySelector('#country-input') as HTMLElement).focus();
	};

	const makeMatchBold = (str: string) => {
		// replace part of (country name === inputValue) with strong tags
		let matched = str.substring(0, inputValue.length);
		let makeBold = `<strong>${matched}</strong>`;
		let boldedMatch = str.replace(matched, makeBold);
		return boldedMatch;
	};

	const removeBold = (str: string) => {
		//replace < and > all characters between
		return str.replace(/<(.)*?>/g, '');
	};

	/* NAVIGATING OVER THE LIST OF COUNTRIES W HIGHLIGHTING */
	let hiLiteIndex = null;

	const navigateList = (e: KeyboardEvent) => {
		if (e.key === 'ArrowUp') {
			if (hiLiteIndex === null || hiLiteIndex === filteredCountries.length - 1) {
				hiLiteIndex = 0;
				return;
			}
			hiLiteIndex += 1;
		}
		if (e.key === 'ArrowDown' && hiLiteIndex !== null) {
			hiLiteIndex === 0 ? (hiLiteIndex = filteredCountries.length - 1) : (hiLiteIndex -= 1);
		} else if (e.key === 'Enter' && hiLiteIndex !== null) {
			e.preventDefault();
			setInputVal(filteredCountries[hiLiteIndex]);
		}
	};
</script>

<svelte:window on:keydown={navigateList} />

<div class="autocomplete">
	<input
		id="country-input"
		type="text"
		placeholder="Search Country Names"
		bind:value={inputValue}
		on:input={filterCountries}
	/>
	<!-- FILTERED LIST OF COUNTRIES -->
	{#if filteredCountries.length > 0}
		<ul id="autocomplete-items-list">
			{#each filteredCountries as country, i}
				<Country
					itemLabel={country}
					highlighted={i === hiLiteIndex}
					position={i}
					on:click={() => setInputVal(country)}
				/>
			{/each}
		</ul>
	{/if}
</div>

<style>
	div.autocomplete {
		display: inline-block;
		width: 300px;
	}
	input {
		box-sizing: border-box;
		border: none;
		background-color: #f1f1f1;
		padding: 10px;
		font-size: 16px;
		margin: 0;
		width: 100%;
	}
	input[type='text'] {
		background-color: #f1f1f1;
	}

	#autocomplete-items-list {
		position: relative;
		margin: 0;
		padding: 0;
		top: 0;
		width: 300px;
		background-color: #ddd;
	}
</style>
