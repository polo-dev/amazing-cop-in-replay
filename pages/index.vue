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
        <start v-if="currentRouteName === 'index'"></start>
      </v-container>
    </v-content>
    <app-footer/>
  </v-app>
</template>

<script>

  import Playlist from '~/components/Playlist.vue'
  import AppFooter from '~/components/Footer.vue'
  import AppNavBar from '~/components/NavBar.vue'
  import Start from '~/components/content/Start.vue'
  import axios from 'axios'
  import _ from 'lodash'


  export default {
    components: {
      Playlist,
      AppFooter,
      AppNavBar,
      Start
    },
    data() {
      return {
        search: '',
        answer: '',
        parentDrawer: false
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
    async fetch({store, params}) {
      if (store.state.access_token) {
        let method = 'check_auth'
        let data = await axios
          .get('http://localhost:3000/api/get?access_token=' + store.state.access_token + '&method=' + method)
          .catch(error => {
            console.log(error)
          })
          .finally()
        if (!data) {
          store.state.access_token = false
          store.commit('SET_TOKEN', false)
        }
      } else {
        store.state.access_token = false
        store.commit('SET_TOKEN', false)
      }

    },
    methods: {
      handleDrawerDataBack(event) {
        this.parentDrawer = event
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
