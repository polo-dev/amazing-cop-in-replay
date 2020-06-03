<template>
  <nav>
    <v-navigation-drawer
      v-model="childDrawer"
      app
    >
      <v-list dense>
        <v-list-item link to="/">
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/cgu">
          <v-list-item-action>
            <v-icon>mdi-contact-mail</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              CGU
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="teal"
      dark
    >
      <v-app-bar-nav-icon v-model="childDrawer" @click.stop="handleDrawer"/>
      <v-toolbar-title>Spotify To Youtube</v-toolbar-title>
    </v-app-bar>
  </nav>
</template>

<script>
  export default {
    data: () => ({
      drawer: false,
    }),
    props: {
      parentDrawer: {
        type: Boolean,
        default () {
          return false
        }
      },
      childDrawer: Boolean
    },
    watch : {
      drawer: function (value) {
        this.$emit('interface', value)
      },
      childDrawer: function (value) {
        this.drawer = value
      }
    },
    beforeMount() {
      this.drawer = this.parentDrawer
    },
    methods: {
      handleDrawer: function () {
        this.drawer = !this.drawer
        this.$emit('update:drawer', this.drawer)
      }
    }
  }
</script>
