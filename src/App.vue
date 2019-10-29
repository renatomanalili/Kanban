<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>KANBAN</span>
        <!-- <span class="font-weight-light">MATERIAL DESIGN</span> -->
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-content>
      <Kanban/>
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
};
</script>
