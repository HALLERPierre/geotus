<script lang="ts">
	export let direction: string;

	const directionIcon = (() => {
		switch (direction) {
			case 'N':
				return '↑';
			case 'NE':
				return '↗';
			case 'E':
				return '↗';
			case 'NE':
				return '→';
			case 'SE':
				return '↘';
			case 'S':
				return '↓';
			case 'SW':
				return '↙';
			case 'W':
				return '←';
			case 'NW':
				return '↖';
			default:
				return '↭';
		}
	})();
</script>

{directionIcon}
