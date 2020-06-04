<template>
  <v-toolbar
    dense
    floating
  >
    <v-text-field
      hide-details
      prepend-icon="search"
      single-line
      v-model="search"
    ></v-text-field>
  </v-toolbar>
</template>
<style lang="scss" scoped>
  .v-toolbar--floating {
    max-width: 200px;
    position: sticky;
    top: 75px;
    z-index: 100;
  }
</style>

<script>
  export default {
    data: () => ({
      search: null
    }),
    watch: {
      search: function(value) {
        this.$emit('search', value)
      }
    }
  }
</script>
