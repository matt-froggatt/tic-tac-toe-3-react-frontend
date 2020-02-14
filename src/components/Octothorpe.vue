<template>
	<table class="oct-container">
		<tr>
			<th class="grid-cell bottom right">X</th>
			<th class="grid-cell bottom left right"></th>
			<th class="grid-cell bottom left"></th>
		</tr>
		<tr>
			<th class="grid-cell top bottom right"></th>
			<th class="grid-cell top bottom left right"></th>
			<th class="grid-cell top bottom left"></th>
		</tr>
		<tr>
			<th class="grid-cell top right"></th>
			<th class="grid-cell top left right"></th>
			<th class="grid-cell top left"></th>
		</tr>
	</table>
</template>

<script>

	export default {
		name: 'Octothorpe',
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.oct-container {
		margin: 3vh;
		border-collapse: collapse;
	}

	.top {
		border-top: solid black 5px;
	}

	.bottom {
		border-bottom: solid black 5px;
	}

	.left {
		border-left: solid black 5px;
	}

	.right {
		border-right: solid black 5px;
	}

	.grid-cell {
		font-size: 10vw;
		height: 10vw;
		width: 10vw;
	}
</style>
