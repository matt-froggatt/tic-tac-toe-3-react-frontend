<template>
  <div id="app">
    <Board msg="Hi World"/>
  </div>
</template>

<script>
import Board from './components/Board.vue'

export default {
  name: 'app',
  components: {
    Board
  }
}
</script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: white;
  min-height: 100vh;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
