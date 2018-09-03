<template>
  <div id="app">
    <div class="home">
      <header-page></header-page>
      <body-left></body-left>
      <body-right></body-right>
    </div>
  </div>
</template>

<script>
import headerPage from './components/header/index.vue';
import bodyLeft from './components/body/body-left/index.vue';
import bodyRight from './components/body/body-right/index.vue';
export default {
  components: {headerPage,bodyLeft,bodyRight},
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
