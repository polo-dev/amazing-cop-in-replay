<template>
   <b-row class="justify-content-md-center text-center" v-if="playlists">
    <div class="loading-page" v-if="loading">
      <div class="test"><p>Loading...</p></div>
    </div>
      <div v-for="(playlist, index) in playlists" :key="playlist.id">
        <b-col>
          <div v-on:click="getPlaylistTrack(playlist.id)">
            <b-img-lazy width="300" height="300" thumbnail fluid v-bind:src="playlist.images[0].url" alt="Thumbnail" />
          </div>
          <!-- <p v-html="computedClass(index)"></p> -->
          <p v-html="playlist.name"></p>
          <button v-if="display(playlist.id)" v-on:click="convertToYoutube(playlist.id)">Convertir en playlist youtube</button>
          <b-list-group v-if="display(playlist.id)">
            <b-list-group-item v-for="(track) in tracks[playlist.id].content" :key="track.track.id">
              {{ track.track.name }}
            </b-list-group-item>
          </b-list-group>
        </b-col>
         <div v-if="computedClass(index) === 0" class="w-100"></div>
      </div>
      <p v-if="tracks">test</p>
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
      tracks: [],
      loading: false
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
  watch: {
    
  },
  methods: {
     start () {
      this.loading = true
    },
    finish () {
      this.loading = false
    },
    display(playlist_id) {
      if (!this.tracks || !this.tracks[playlist_id]) {
        return false
      }
      return this.tracks[playlist_id]['display']
    },
    computedClass(index) {
      if ((index + 1) % 3 === 0) { 
         index = 0 
      } else {
         index++
      }
      return index;
    },
    async getPlaylistTrack(playlist_id) {
       if (this.tracks && this.tracks[playlist_id]) {
        let rep = !this.tracks[playlist_id]['display']
        this.$set(this.tracks[playlist_id],'display', rep)
      } else {
        let access_token = this.$store.state.access_token
        let method = 'getTracksPlaylist'
        let data = await axios
            .get('/api/get?access_token=' + access_token + '&method=' + method + '&limit=' + this.limit + '&offset=' + this.offset + '&params[]=' + playlist_id)
            .then(response => {
              return response.data.items.items
            })
            .catch(error => {
              console.log(error)
            })
            .finally()

        let dateSet = {
          content: data,
          display: true
        }
        this.$set(this.tracks, playlist_id, dateSet)
        console.log(this.tracks)
      }
    },
    async convertToYoutube(playlist_id) {
      console.log(playlist_id)
      console.log(this.tracks[playlist_id])
      this.start()
      let data = await axios
            .post('/api/youtube/convert/spotify', {
              tracks: this.tracks[playlist_id].content
            })
            .then(response => {
              return response.data
            })
            .catch(error => {
              console.log(error)
            })
            .finally()

        if (data.error && data.redirectUrl) {
          this.answser = data.redirectUrl
          return
        }

      this.finish()
    }
  }
}

</script>