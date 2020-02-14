<template>
	<div class="oct-container">
		<div v-for="n in 9" :key="n" class="oct-grid"><XO/><p class="letter">X</p></div>
	</div>
</template>

<script>
	import XO from './XO.vue'
	export default {
		name: 'MiniOcto',
		props: {
			xo: String
		},
		components: {
			XO
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.oct-container {
		padding: 3vh;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
	}

	.oct-grid:nth-child(3n + 1)::after {
		content: "";
		position: absolute;
		right: 0;
		top: 0;
		bottom: 0;
		width: 5px;
		background-color: black;
	}

	.oct-grid:nth-child(3n + 1)::after {
		content: "";
		position: absolute;
		right: 0;
		top: 0;
		bottom: 0;
		width: 5px;
		background-color: black;
	}

	.oct-grid:nth-child(3n)::after {
		content: "";
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 5px;
		background-color: black;
	}

	.oct-grid:nth-child(-n + 3)::before {
		content: "";
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 5px;
		background-color: black;
	}

	.oct-grid:nth-child(n+7)::before {
		content: "";
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		height: 5px;
		background-color: black;
	}

	.oct-grid:nth-child(1)::after {
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	}

	.oct-grid:nth-child(1)::before {
		border-top-left-radius: 10px;
		border-bottom-left-radius: 10px;
	}

	.oct-grid:nth-child(3)::after {
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	}

	.oct-grid:nth-child(3)::before {
		border-top-right-radius: 10px;
		border-bottom-right-radius: 10px;
	}

	.oct-grid:nth-child(7)::after {
		border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px;
	}

	.oct-grid:nth-child(7)::before {
		border-top-left-radius: 10px;
		border-bottom-left-radius: 10px;
	}

	.oct-grid:nth-child(9)::after {
		border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px;
	}

	.oct-grid:nth-child(9)::before {
		border-top-right-radius: 10px;
		border-bottom-right-radius: 10px;
	}
	.letter {
		margin: 0;
	}
</style>
