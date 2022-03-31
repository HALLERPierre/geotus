<script lang="ts">
	export let itemLabel: string;
	export let highlighted: boolean;
	export let position: number;
</script>

<li
	class="autocomplete-items"
	class:autocomplete-active={highlighted}
	on:click
	style="bottom: {position * 40 + 40}px"
>
	{@html itemLabel}
</li>

<style>
	li.autocomplete-items {
		position: absolute;
		list-style: none;
		border-bottom: 1px solid #d4d4d4;
		z-index: 99;
		left: 0;
		right: 0;
		padding: 10px;
		cursor: pointer;
		background-color: #fff;
		height: 40px;
		box-sizing: border-box;
	}

	li.autocomplete-items:hover {
		/*when hovering an item:*/
		background-color: #81921f;
		color: white;
	}

	li.autocomplete-items:active {
		/*when navigating through the items using the arrow keys:*/
		background-color: DodgerBlue !important;
		color: #ffffff;
	}

	.autocomplete-active {
		/*when navigating through the items using the arrow keys:*/
		background-color: DodgerBlue !important;
		color: #ffffff;
	}
</style>
