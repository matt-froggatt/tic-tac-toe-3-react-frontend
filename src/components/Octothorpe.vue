<template>
	<table class="oct-container">
		<tr>
			<th @click="$emit('test')" class="grid-cell bottom right"> {{state[0]}} </th>
			<th @click="$emit('test')" class="grid-cell bottom left right"> {{state[1]}} </th>
			<th @click="$emit('test')" class="grid-cell bottom left"> {{state[2]}} </th>
		</tr>
		<tr>
			<th @click="$emit('test')" class="grid-cell top bottom right"> {{state[3]}} </th>
			<th @click="$emit('test')" class="grid-cell top bottom left right"> {{state[4]}} </th>
			<th @click="$emit('test')" class="grid-cell top bottom left"> {{state[5]}} </th>
		</tr>
		<tr>
			<th @click="$emit('test')" class="grid-cell top right"> {{state[6]}} </th>
			<th @click="$emit('test')" class="grid-cell top left right"> {{state[7]}} </th>
			<th @click="$emit('test')" class="grid-cell top left"> {{state[8]}} </th>
		</tr>
	</table>
</template>

<script>

	export default {
		name: 'Octothorpe',
		props: {
			state: Array
		}
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
