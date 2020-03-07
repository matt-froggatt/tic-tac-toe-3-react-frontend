<template>
  <div class="xo" @click="this.$parent.$emit('test')">{{Character}}</div>
</template>

<script>
export default {
  name: "XO",
  props: {
    Character: String
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
