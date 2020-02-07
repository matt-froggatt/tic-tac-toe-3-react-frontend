<template>
  <div id="board">
    <Octothorpe msg="hello"/>
  </div>
</template>

<script>
import Octothorpe from './Octothorpe.vue'

export default {
  name: 'Board',
  props: {
    msg: String
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
  border-style: solid;
  background-color: yellow;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
