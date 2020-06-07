<template>
  <v-col
    :key="i"
    cols="12"
    md="4"
  >
    <v-dialog v-model="dialog" width="600px">
      <template v-slot:activator="{ on }">
        <v-lazy
          :options="{
          threshold: 0.7
        }"
          min-height="200"
          transition="fade-transition">

          <v-hover v-slot:default="{ hover }">

            <v-card
              :elevation="hover ? 12 : 2"
              :class="{ 'on-hover': hover }"
              class="fill-height"
            >
              <v-img
                :lazy-src="'avatar/default-album.png'"
                :src="playlist.images[0].url"
                height="225px"
                v-on="on"
                v-on:click="getPlaylistTrack(playlist.id, playlist.tracks.total)"
                @click="loading = !loading"
              >
                <div class="fill-height bottom-gradient" style="display: flex">
                  <v-card-title class="title white--text fill-height">
                    <v-row
                      class="fill-height"
                      justify="space-between"
                      align="end"
                    >
                      <v-col>
                        <p class="mt-4 subheading text-left">
                          {{ playlist.name }}
                        </p>

                        <p class="ma-0 body-1 font-weight-bold font-italic text-left">
                          <span v-if="playlist.description" v-html="playlist.description"></span>
                          <span v-else>{{ playlist.name }}</span>
                        </p>
                        <p class="caption font-weight-medium font-italic text-left">
                          Nombre de tracks {{ playlist.tracks.total }}
                        </p>

                      </v-col>

                    </v-row>
                  </v-card-title>
                </div>
              </v-img>
            </v-card>
          </v-hover>
        </v-lazy>
      </template>
      <v-overlay :value="loading">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
      <v-card
        color="white"
        dark
        v-if="loading"
      >
      </v-card>
      <v-card v-if="display(playlist.id)" class="v-card-opacity" width="600px">
        <v-card-title>
          <span class="headline">{{ playlist.name }}</span>
        </v-card-title>
        <v-list three-line>
          <template v-for="(track, index) in tracks[playlist.id].content">
            <v-divider
              :key="index"
              :inset="true"
            ></v-divider>
            <v-list-item
              :key="track.track.id"
            >
              <v-list-item-avatar>
                <v-img v-if="track.track.album.images[2]" :lazy-src="'avatar/default-album.png'" :src="track.track.album.images[2].url"></v-img>
                <v-img v-else-if="track.track.album.images[0]" :lazy-src="'avatar/default-album.png'" :src="track.track.album.images[0].url"></v-img>
                <v-img v-else :src="'avatar/default-album.png'"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title v-html="track.track.name"></v-list-item-title>
                <v-list-item-subtitle v-html="track.track.album.name"></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog = false">Agree</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-col>
</template>

<style lang="scss" scoped>
  .v-card {
    transition: opacity .4s ease-in-out;
  }
  .v-card:not(.on-hover) {
    opacity: 0.85;
  }
  .v-card:not(.on-hover).v-card-opacity {
    opacity: 1;
  }
  .bottom-gradient {
    background-image: linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, transparent 57%);
  }
  .v-application .title {
    padding-bottom: 5px;
  }
  .v-application p {
    margin-bottom: 7px;
  }
</style>

<script>
  import axios from 'axios'

  export default {
    props: ['playlist', 'i', 'playlistId'],
    data() {
      return {
        dialog: false,
        tracks: [],
        limitTracks: 100,
        offset: 0,
        loading: false
      }
    },
    methods: {
      display(playlist_id) {
        return this.tracks && this.tracks[playlist_id]
      },
      async getPlaylistTrack(playlist_id, total) {

        if (!this.tracks || !this.tracks[playlist_id]) {
          let access_token = this.$store.state.access_token;
          let method = "getTracksPlaylist";
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
              if (typeof response.data.items.items !== "undefined")
                return response.data.items.items;
              else {
                let data = [];
                for (var i = 0; response.data.items.length > i; i++) {
                  data.push(response.data.items[i].items);
                }
                return data.flat();
              }
            })
            .catch(error => {
              console.log(error);
              console.log(
                "error get tracks spotify : ",
                error,
                error.response.data
              );
              return error.response.data;
            })
            .finally(() => {
              this.loading = false
            });

          if (data.error && data.redirectUrl) {
            window.location.href = data.redirectUrl;
            return;
          }

          let dateSet = {
            content: data
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
        }
      }
    }
  };
</script>
