<template>
  <v-row
    align="center"
    justify="center"
  >
    <v-col
      class="text-center"
      cols="12"
      sm="8"
      md="4">
      <v-card class="elevation-12">
        <v-toolbar
          color="teal"
          dark
          flat
        >
          <v-toolbar-title>Importer mes playlists</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form>
            <p>
              Pour importer une playlist à ton compte, il te suffit de te logger à l'api Spotify en cliquant sur ce bouton!
            </p>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <div class="my-2">
            <v-btn x-large color="success" dark href="/api/login">Alons-y!</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  export default {

  }
</script>
