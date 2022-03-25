<script lang="ts">
	import type { DirectionEnum } from './types';

	export let direction: DirectionEnum | undefined;

	const tick = 90;
	const demiTick = 90 / 2;
	const quartTick = demiTick / 2;

	console.log({ direction });
	const rotation = (() => {
		switch (direction) {
			case 'N':
				return 0;
			case 'NNE':
				return quartTick;
			case 'NE':
				return demiTick;
			case 'ENE':
				return demiTick + quartTick;
			case 'E':
				return tick;
			case 'ESE':
				return tick + quartTick;
			case 'SE':
				return tick + demiTick;
			case 'SSE':
				return tick + demiTick + quartTick;
			case 'S':
				return 2 * tick;
			case 'SSW':
				return 2 * tick + quartTick;
			case 'SW':
				return 2 * tick + demiTick;
			case 'WSW':
				return 2 * tick + demiTick + quartTick;
			case 'W':
				return 3 * tick;
			case 'WNW':
				return 3 * tick + quartTick;
			case 'NW':
				return 3 * tick + demiTick;
			case 'NNW':
				return 3 * tick + demiTick + quartTick;
			default:
				return 0;
		}
	})();
</script>

<span class="direction" style="transform: rotate({rotation}deg);">↑</span>

<style>
	.direction {
		margin: 0;
		font-size: 24px;
	}
</style>
