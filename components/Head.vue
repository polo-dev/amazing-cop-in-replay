<template>
  <v-app-bar
    app
    color="indigo"
    dark
  >
    <v-app-bar-nav-icon @click.stop="$emit('drawer')" />
    <v-toolbar-title>Application</v-toolbar-title>
  </v-app-bar>

</template>

<style lang="scss" scoped>
.navbar {
  background-color: #456990;
  .navbar-brand {
    color: #F3EFE0;
  }
}
.text-center {
  margin: auto;
}
</style>
