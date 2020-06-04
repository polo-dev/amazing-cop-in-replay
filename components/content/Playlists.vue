<template>
  <v-row class="fill-height">
    <v-col
      cols="12"
      md="4"
      class="text-center"
      v-for="s in [1,2,3,4,5,6,7,8,9]"
      v-bind:key="s"
      v-if="loading"
    >
      <v-skeleton-loader
        :loading="true"
        min-height="200"
        height="200"
        type="card"
      ></v-skeleton-loader>
    </v-col>
    <playlist
      v-for="(playlist, i) in filteredList"
      v-bind:key="playlist.id"
      v-bind:i="i"
      v-bind:playlist="playlist"
    />
  </v-row>
</template>

<style lang="scss" scoped>
  .v-card {
    transition: opacity .4s ease-in-out;
  }

  .v-card:not(.on-hover) {
    opacity: 0.6;
  }

  .show-btns {
    color: rgba(255, 255, 255, 1) !important;
  }
</style>

<script>
  import axios from "axios";
  import Playlist from "~/components/content/Playlist.vue";

  export default {
    components: {
      Playlist
    },
    watch: {
      playlists: function(value) {
        this.$emit('hasPlaylists', !!value)
      }
    },
    props: ['search'],
    data() {
      return {
        playlists: null,
        limitPlaylist: 50,
        limitTracks: 100,
        offset: 0,
        tracks: [],
        loading: true
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
          console.log(this.playlists)
        })
        .catch(error => {
          this.playlists = null;
          this.$emit('hasPlaylists', false)
          console.log(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    computed: {
      filteredList() {
        if (this.playlists) {
          if (this.search.length === 0) {
            return this.playlists
          }
          return this.playlists.filter(playlist => {
            return playlist.name.toLowerCase().includes(this.search.toLowerCase())
          })
        }
        return null
      }
    },
    methods: {
      start() {
        this.loading = true;
      },
      finish() {
        this.loading = false;
      },
      computedClass(index) {
        if ((index + 1) % 3 === 0) {
          index = 0;
        } else {
          index++;
        }
        return index;
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
            console.log("success convert : ", response);
            return response.data;
          })
          .catch(error => {
            console.log("error convert : ", error, error.response.data);
            return error.response.data;
          })
          .finally();

        this.finish();

        if (data.error && data.redirectUrl) {
          window.location.href = data.redirectUrl;
          return;
        }
      }
    }
  };
</script>
