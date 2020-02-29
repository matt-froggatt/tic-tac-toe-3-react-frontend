<template>
	<div id="board">
		<Octothorpe :state="state"/>
	</div>
</template>

<script>
	import Octothorpe from './Octothorpe.vue'

	export default {
		name: 'Board',

		data() {
			return {
				state: ['X', '', '',
					'', '', '',
					'', 'O', '']
			}
		},

		components: {
			Octothorpe
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	#board {
		border-radius: 10px;
		border: solid #533C00 5px;
		background-color: rgb(253, 255, 147);
		display: table;
		margin: 0 auto;
	}

</style>
