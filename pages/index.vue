<template>
   <div id="app">
      <app-head/>
      <b-container fluid>
         <b-row>
            <b-col v-if="!getAccessToken()">
            <div class="loggin">
               <b-card title="Loggin"
                        img-src="http://images6.fanpop.com/image/photos/40300000/Spotify-spotify-40342607-3840-2160.jpg"
                        img-alt="Image"
                        img-top
                        tag="article"
                        style="max-width: 20rem;margin: auto"
                        class="mb-2">
                  <p class="card-text">
                  Pour importer une playlist à ton compte, il te suffit de te logger à l'api Spotify en cliquant sur ce bouton!
                  </p>
                  <!-- <b-button v-on:click="loggIn" variant="primary">Allons-y!</b-button> -->
                  <b-button variant="primary" href="/api/login">Allons-y!</b-button>
               </b-card>
            </div>
            </b-col>
             <b-col v-if="getAccessToken()">
               <p>trololol</p>
             </b-col>
         </b-row>
      </b-container>
   </div>
</template>

<script>
import AppHead from '~/components/Head.vue'

export default {
  components: {
     AppHead
  },
  methods: {
    getAccessToken: function () {
      let access_token = this.$cookies.get('access_token')
      return (access_token) ? access_token : false
    },
  }
}
</script>

<style lang="sass" scoped>
  .loggin 
    margin-top: 60px
</style>
