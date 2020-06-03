<template>
  <v-app id="inspire">

    <app-nav-bar :childDrawer.sync="parentDrawer"
                 @interface="handleDrawerDataBack"/>
    <v-content>
      <v-container
        class="fill-height"
        fluid
        @click="parentDrawer = false"
      >
        <start v-if="!checkStateAccesToken"/>
        <search v-if="checkStateAccesToken" @search="handleSearchDataBack"/>
        <playlists v-if="checkStateAccesToken" v-bind:search="search" @hasPlaylists="handleHasPlaylist"/>
      </v-container>
    </v-content>
    <app-footer/>
  </v-app>
</template>

<script>

  import Playlists from '~/components/content/Playlists.vue'
  import AppFooter from '~/components/Footer.vue'
  import AppNavBar from '~/components/NavBar.vue'
  import Start from '~/components/content/Start.vue'
  import Search from '~/components/content/Search.vue'
  import axios from 'axios'
  import _ from 'lodash'


  export default {
    components: {
      Playlists,
      AppFooter,
      AppNavBar,
      Start,
      Search
    },
    data() {
      return {
        search: '',
        answer: '',
        parentDrawer: false,
      }
    },
    props: {
      source: String,
      drawer: Boolean
    },
    computed: {
      checkStateAccesToken: function () {
        return !!(this.$store.state && this.$store.state.access_token)
      },
      currentRouteName() {
        return this.$route.name
      }
    },
    watch: {
      search: function (newQuestion, oldQuestion) {
        this.debouncedGetAnswer()
      },
      parentDrawer: function (value) {
        this.parentDrawer = value
      }
    },
    created: function () {
      this.debouncedGetAnswer = _.debounce(this.getSearch, 500)
    },
    async fetch() {
      if (this.$store.state.access_token) {
        let method = 'check_auth'
        let data = await axios
          .get(window.location.origin + '/api/get?access_token=' + this.$store.state.access_token + '&method=' + method)
          .catch(error => {
            console.log(error)
          })
          .finally()
        if (!data) {
          this.$store.state.access_token = false
          this.$store.commit('SET_TOKEN', false)
        }
      } else {
        this.$store.state.access_token = false
        this.$store.commit('SET_TOKEN', false)
      }
    },
    methods: {
      handleDrawerDataBack(event) {
        this.parentDrawer = event
      },
      handleSearchDataBack(event) {
        this.search = event
      },
      handleHasPlaylist(event) {
        if (!event) {
          this.$store.commit('SET_TOKEN', false)
        }
      },
      getAccessToken: function () {
        let access_token = this.$cookies.get('access_token')
        return (access_token) ? access_token : false
      },
      test: async function () {
        let data = await axios
          .get('/api/youtube/search?params=south+beach+vicetone')
          .then(response => {
            return response.data
          })
          .catch(error => {
            console.log(error)
          })
          .finally()

        console.log(data)
      },
      getSearch: async function () {
        let s = this.search.split(' ').join('+');
        let data = await axios
          .get('/api/youtube/search?params=' + s)
          .then(response => {
            return response.data
          })
          .catch(error => {
            console.log(error)
          })
          .finally()

        if (data.error && data.redirectUrl) {
          this.answer = data.redirectUrl
          return
        }
        console.log(data)
        console.log(data.items.items[0])
        this.answer = 'https://youtube.com/watch?v=' + data.items.items[0].id.videoId
      }
    }
  }
</script>

<style lang="sass" scoped>
  .loggin
    margin-top: 60px
</style>
