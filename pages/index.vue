<template>
   <div id="app">
      <app-head/>
      <b-container fluid>
         <b-row>
            <b-col v-if="!$store.state.auth">
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
             <b-col v-if="$store.state.auth">
               <p v-html="$store.state.auth">trololol</p>
               <b-button v-on:click="getPlaylists()" variant="primary">Test playlists</b-button>
             </b-col>
         </b-row>
      </b-container>
   </div>
</template>

<script>
import AppHead from '~/components/Head.vue'
import axios from 'axios'

export default {
  components: {
     AppHead
  },
  async fetch ({ store, params }) {
    
  },
  mounted () {
    
  },
  methods: {
    getAuth: async function () {
      let access_token = this.getAccessToken()
      if (access_token && access_token !== 'undefined') {
        let data = await axios
        .get('/api/check_auth?access_token=' + access_token)
        .then(response => {
            console.log(response.data.auth)
            this.$store.commit('changeAuth', response.data.auth)
            return response.data.auth
        })
        .catch(error => {
          console.log(error)
        })
        .finally()

        console.log(data);
        return data
      }
    },
    getAccessToken: function () {
      let access_token = this.$cookies.get('access_token')
      return (access_token) ? access_token : false
    },
    getPlaylists: function () {
      let access_token = this.$store.state.auth
      let limit = 10
      let offset = 0
      let method = 'playlists'
      axios
        .get('/api/get?access_token=' + access_token + '&method=' + method + '&limit=' + limit + '&offset=' + offset)
        .then(response => {
            return response.data
        })
        .catch(error => {
          console.log(error)
        })
        .finally()
    }
  }
}
</script>

<style lang="sass" scoped>
  .loggin 
    margin-top: 60px
</style>
