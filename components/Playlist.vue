<template>
  <b-row class="justify-content-md-center text-center" v-if="playlists">
    <div class="loading-page" v-if="loading">
      <div class="test">
        <p>Loading...</p>
      </div>
    </div>
    <div v-for="(playlist, index) in playlists" :key="playlist.id">
      <b-col>
        <div v-on:click="getPlaylistTrack(playlist.id, playlist.tracks.total)">
          <b-img-lazy
            width="300"
            height="300"
            thumbnail
            fluid
            v-bind:src="playlist.images[0].url"
            alt="Thumbnail"
          />
        </div>
        <!-- <p v-html="computedClass(index)"></p> -->
        <p v-html="playlist.name"></p>
        <button
          v-if="display(playlist.id)"
          v-on:click="convertToYoutube(playlist.id, index)"
        >Convertir en playlist youtube</button>
        <b-list-group v-if="display(playlist.id)">
          <b-list-group-item
            v-for="(track) in tracks[playlist.id].content"
            :key="track.track.id"
          >{{ track.track.name }}</b-list-group-item>
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
import axios from "axios";

export default {
  data() {
    return {
      playlists: null,
      limitPlaylist: 50,
      limitTracks: 100,
      offset: 0,
      tracks: [],
      loading: false
    };
  },
  mounted() {
    let access_token = this.$store.state.access_token;
    let method = "playlists";
    axios
      .get(
        "/api/get?access_token=" +
          access_token +
          "&method=" +
          method +
          "&limit=" +
          this.limitPlaylist +
          "&offset=" +
          this.offset
      )
      .then(response => {
        this.playlists = response.data.items.items;
      })
      .catch(error => {
        console.log(error);
      })
      .finally();
  },
  watch: {},
  methods: {
    start() {
      this.loading = true;
    },
    finish() {
      this.loading = false;
    },
    display(playlist_id) {
      if (!this.tracks || !this.tracks[playlist_id]) {
        return false;
      }
      return this.tracks[playlist_id]["display"];
    },
    computedClass(index) {
      if ((index + 1) % 3 === 0) {
        index = 0;
      } else {
        index++;
      }
      return index;
    },
    async getPlaylistTrack(playlist_id, total) {
      if (this.tracks && this.tracks[playlist_id]) {
        let rep = !this.tracks[playlist_id]["display"];
        this.$set(this.tracks[playlist_id], "display", rep);
      } else {
        let access_token = this.$store.state.access_token;
        let method = "getTracksPlaylist";
        console.log(total)
        let data = await axios
          .get(
            "/api/get?access_token=" +
              access_token +
              "&method=" +
              method +
              "&limit=" +
              this.limitTracks +
              "&offset=" +
              this.offset +
              "&params[]=" +
              playlist_id +
              "&total=" +
              total
          )
          .then(response => {
            if (typeof response.data.items.items !== 'undefined')
              return response.data.items.items;
            else {
              let data = []
              for (var i = 0; response.data.items.length > i ;i++) {
                data.push(response.data.items[i].items)
              }
              return data.flat()
            }
          })
          .catch(error => {
            console.log(error);
          })
          .finally();

        let dateSet = {
          content: data,
          display: true
        };
        this.$set(this.tracks, playlist_id, dateSet);
        console.log(this.tracks);
      }
    },
    async convertToYoutube(playlist_id, index) {
      console.log(playlist_id);
      let content = this.tracks[playlist_id].content;
      let tracks = [];
      for (let index = 0; index < content.length; index++) {
        let track = content[index].track;
        tracks.push({
          name: track.name,
          album: track.album.name,
          artists: track.artists
        });
      }
      console.log(tracks);
      this.start();
      let data = await axios
        .post("/api/youtube/convert/spotify", {
          tracks: tracks,
          name: this.playlists[index].name,
          public: this.playlists[index].public
        })
        .then(response => {
          console.log('success convert : ', response)
          return response.data
        })
        .catch(error => {
          console.log('error convert : ', error, error.response.data)
          return error.response.data
        })
        .finally();

      this.finish();

      if (data.error && data.redirectUrl) {
        window.location.href = data.redirectUrl
        return;
      }

    }
  }
};
</script>