<template>
  <div id="app">
    <Board :state="state" v-on:test="doSomething" />
  </div>
</template>

<script>
import Board from "./components/Board.vue";

export default {
  name: "app",
  components: {
    Board
  },
  data() {
    return {
      state: ["X", "O", "X", "O", "X", "O", "X", "O", "X"]
    };
  },

  methods: {
    doSomething() {
      alert("yes");
    }
  }
};
</script>
<style>
html {
  background-color: white;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: black;
}
</style>
