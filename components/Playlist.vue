<template>
   <b-row class="justify-content-md-center text-center" v-if="playlists">
      <div v-for="(playlist, index) in playlists" :key="playlist.id" v-on:click="getPlaylistTrack(playlist.id)">
        <b-col>
          <b-img-lazy width="300" height="300" thumbnail fluid v-bind:src="playlist.images[0].url" alt="Thumbnail" />
          <p v-html="computedClass(index)"></p>
          <b-list-group v-if="trakcs[playlist.id] == true">
            <b-list-group-item v-for="(track) in trakcs[playlist.id]" :key="track.track.id">
              {{ track.track.name }}
            </b-list-group-item>
          </b-list-group>
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
      playlists: null,
      limit: 50,
      offset: 0,
      trakcs: []
    }
  },
  mounted () {
      let access_token = this.$store.state.access_token
      let method = 'playlists'
      axios
        .get('/api/get?access_token=' + access_token + '&method=' + method + '&limit=' + this.limit + '&offset=' + this.offset)
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
    },
    getPlaylistTrack(playlist_id) {
      let access_token = this.$store.state.access_token
      let method = 'getTracksPlaylist'
      axios
        .get('/api/get?access_token=' + access_token + '&method=' + method + '&limit=' + this.limit + '&offset=' + this.offset + '&params[]=' + playlist_id)
        .then(response => {
          this.trakcs[playlist_id] = response.data.items.items
          console.log(this.trakcs[playlist_id])
        })
        .catch(error => {
          console.log(error)
        })
        .finally()
    }
  }
}

</script>