<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <router-link to="/" v-if="$router.currentRoute.name!='login'"><span>KANBAN</span></router-link>
        <span v-else>KANBAN</span>
        <!-- <span class="font-weight-light">MATERIAL DESIGN</span> -->
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- MENU -->
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
            <v-list-item-title ><v-btn @click="logout" text>Logout</v-btn></v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn v-if="$router.currentRoute.name == 'login'" @click="dialog = true" rounded color="#1E88E5" class="white--text">LOGIN</v-btn>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>

    <!-- MODAL -->
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline-modal">Login Via</v-card-title>
        <v-card-text>
          <v-list-item @click="signInGoogle">
            <v-list-item-content>
              <v-list-item-title><v-btn class="mr-3" icon><v-icon color="red">mdi-google</v-icon></v-btn>Google</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="signInGoogle">
            <v-list-item-content>
              <v-list-item-title><v-btn class="mr-3" icon><v-icon color="#3a559f">mdi-facebook</v-icon></v-btn>Facebook</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="signInGoogle">
            <v-list-item-content>
              <v-list-item-title><v-btn class="mr-3" icon><v-icon color="#1dabdd">mdi-twitter</v-icon></v-btn>Twitter</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card-text>
      </v-card>
    </v-dialog>
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
    dialog: false
    //
  }),
  mounted() {
  },
  methods: {
    signInGoogle() {
      this.dialog = false
      const provider = new this.firebase.auth.GoogleAuthProvider();
      this.firebase.auth().signInWithPopup(provider).then((result)=>{
          this.$router.replace('/')
      })
    },
    logout() {
      this.firebase.auth().signOut().then(()=>{
        this.$router.replace('/login')
      })
    }
  }
};
</script>
<style lang="scss" scoped>
  .headline-modal{
    background-color: #1E88E5;
    color: #ffffff;
  }
</style>
