<script lang="ts">
	import { scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	export let show = false;
</script>

{#if show}
	<div
		class="checkmark"
		transition:scale={{
			duration: 500,
			opacity: 1,
			easing: quintOut
		}}
	>
		✓
	</div>
{/if}

<style>
	.checkmark {
		position: absolute;
		top: 40%;
		font-size: 150px;
		color: green;
	}
</style>
