<template lang="html">
  <div class="loading-page" v-if="loading">
    <div class="test"><p>Loading...</p></div>
  </div>
</template>

<script>

import anime from 'animejs'

export default {
  data: () => ({
    loading: false
  }),
  mounted() {
    anime
      .timeline()
      .add({
        targets: '.test',
        translateX: 250,
        easing: 'easeOutExpo',
      })
      .add({
        targets: '.test',
        translateX: 250,
        easing: 'easeOutExpo',
      });
      /* ... etc ... */
  },
  methods: {
    start () {
      this.loading = true
    },
    finish () {
      this.loading = false
    }
  }
}
</script>

<style scoped>
.loading-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  text-align: center;
  padding-top: 200px;
  font-size: 30px;
  font-family: sans-serif;
}
</style>