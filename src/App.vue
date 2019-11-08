<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <router-link to="/"><span>KANBAN</span></router-link>
        <!-- <span class="font-weight-light">MATERIAL DESIGN</span> -->
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu offset-y v-if="$router.currentRoute.name!='login'">
        <template v-slot:activator="{ on }">
          <v-avatar size="36">
            <img
              :src="store.state.user.photo"
              alt="John"
              v-on="on"
            >
          </v-avatar>
        </template>
        <v-list>
          <v-list-item
          >
           <v-list-item-title>{{ store.state.user.name }}</v-list-item-title>
          </v-list-item>
          <v-list-item
          >
            <v-list-item-title @click="logout">Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import Kanban from './components/Kanban';

export default {
  name: 'App',
  components: {
    Kanban,
  },
  data: () => ({
    //
  }),
  mounted() {
  },
  methods: {
    logout() {
      this.firebase.auth().signOut().then(()=>{
        this.$router.replace('/login')
      })
    }
  }
};
</script>
