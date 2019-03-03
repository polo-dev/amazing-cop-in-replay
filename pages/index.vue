<template>
   <div id="app">
      <app-head/>
      <b-container fluid>
        <div v-if="!$store.state.access_token">
        <b-row>
            <b-col>
              <div class="loggin">
                <b-card title="Loggin"
                          img-src="/spotify.jpg"
                          img-alt="Image"
                          img-top
                          tag="article"
                          style="max-width: 20rem;margin: auto"
                          class="mb-2">
                    <p class="card-text">
                    Pour importer une playlist à ton compte, il te suffit de te logger à l'api Spotify en cliquant sur ce bouton!
                    </p>
                    <b-button variant="primary" href="/api/login">Allons-y!</b-button>
                </b-card>
              </div>
            </b-col>
        </b-row>
        </div>
        <div v-if="$store.state.access_token">
          <b-row>
            <a href="/api/youtube/login">test</a>
          </b-row>
          <b-row>
            <b-col>
              <button v-on:click="test()">Button</button>
              <p>
                <input v-model="search">
              </p>
              <p>
                {{ answser }}
              </p>
            </b-col>
          </b-row>
          <b-row>
              <b-col>
              <playlist/>
            </b-col>
          </b-row>
        </div>
      </b-container>
   </div>
</template>

<script>
import AppHead from '~/components/Head.vue'
import Playlist from '~/components/Playlist.vue'
import axios from 'axios'
import _ from 'lodash'

export default {
  components: {
     AppHead,
     Playlist
  },
  data () {
    return {
      search: '',
      answser: ''
    }
  },
  watch: {
    search: function (newQuestion, oldQuestion) {
      this.debouncedGetAnswer()
    }
  },
  created: function () {
    this.debouncedGetAnswer = _.debounce(this.getSearch, 500)
  },
  async fetch ({ store, params }) {
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

        console.log(data)
        console.log(data.items.items[0])
        this.answser = 'https://youtube.com/watch?v=' + data.items.items[0].id.videoId
    }
  }
}
</script>

<style lang="sass" scoped>
  .loggin 
    margin-top: 60px
</style>
