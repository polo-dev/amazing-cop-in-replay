<template>
   <b-row class="justify-content-md-center text-center" v-if="playlists">
      <div v-for="(playlist, index) in playlists" :key="playlist.id">
      <b-col>
         <b-img-lazy width="300" height="300" thumbnail fluid v-bind:src="playlist.images[0].url" alt="Thumbnail" />
         <p v-html="computedClass(index)"></p>
      </b-col>
         <div v-if="computedClass(index) === 0" class="w-100"></div>
      </div>
   </b-row>
</template>

<style lang="scss" scoped>

</style>

<script>
import axios from 'axios'

export default {
   data () {
    return {
      playlists: null
    }
  },
  mounted () {
      let access_token = this.$store.state.access_token
      let limit = 50
      let offset = 0
      let method = 'playlists'
      axios
        .get('/api/get?access_token=' + access_token + '&method=' + method + '&limit=' + limit + '&offset=' + offset)
        .then(response => {
            this.playlists = response.data.items.items
        })
        .catch(error => {
          console.log(error)
        })
        .finally()
  },
  methods: {
    computedClass(index) {
      if ((index + 1) % 3 === 0) { 
         index = 0 
      } else {
         index++
      }
      return index;
    }
  }
}

</script>