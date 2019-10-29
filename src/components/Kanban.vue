<template>
  <v-container>
    <v-btn small color="blue" class="white--text"  @click.stop = "dialog = true">Add ToDo</v-btn>
    <v-row>
      <v-col cols="4">
        To Do
        <draggable class="draggable-height" :list="todo" group="todo" @change="logTodo">
          <v-card  v-for="element in todo"
            :key="element.data.name" class="pa-3 mb-2 white--text" color="#EF5350">
            {{ element.data.name }}
          </v-card>
        </draggable>
      </v-col>
      <v-col cols="4">
        In Progress
        <draggable class="draggable-height" :list="progress" group="todo" @change="logProgress">
          <v-card  v-for="element in progress"
            :key="element.data.name" class="pa-3 mb-2 white--text" color="#42A5F5">
            {{ element.data.name }}
          </v-card>
        </draggable>
      </v-col>
    <v-col cols="4">
       Done
      <draggable class="draggable-height" :list="done" group="todo" @change="logDone">
        <v-card  v-for="element in done"
          :key="element.data.name" class="pa-3 mb-2 white--text" color="#FFAB40" :disabled="true">
          {{ element.data.name }}<v-icon style="float:right" color="#1B5E20">mdi-check-circle</v-icon>
        </v-card>
      </draggable>
    </v-col>
  </v-row>
    
    <!-- dialog  -->
    <v-dialog
      v-model="dialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">Add To Do List</v-card-title>

        <v-card-text>
          <v-text-field v-model="name"></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            text
            @click="submit"
          >
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
      </v-dialog>

  </v-container>
</template>

<script>
import draggable from "vuedraggable";

export default {
  components: {
    draggable
  },
  data: () => ({
    name: '',
    dialog: false,
    todo: [],
    progress: [],
    done: []
  }),
  created() {
    this.read()
  },
  methods: {
    submit() {
      this.$db.collection("kanban").add({
        name: this.name,
        status: 'todo'
      }).then((res)=>{
        this.dialog = false
        this.name = ''
        Object.assign(this.$data, this.$options.data.apply(this))
        this.read()
      })
    
    },
    read() {
      this.$db.collection("kanban").get().then((querySnapShot) => {
        querySnapShot.forEach((res)=>{
          if(res.data().status == 'todo') {
            this.todo.push({
              data:res.data(),
              id: res.id
            })
          }else if(res.data().status == 'progress') {
            this.progress.push(({
              data:res.data(),
              id: res.id
            }))
          }else if(res.data().status == 'done') {
            this.done.push(({
              data:res.data(),
              id: res.id
            }))
          }
        })
      })
    },
    logTodo(args) {
      if(args['added']){
        this.$db.collection("kanban").doc(args['added'].element.id).update({
          status: "todo"
        })
      }
      
    },
    logProgress(args) {
      if(args['added']){
        this.$db.collection("kanban").doc(args['added'].element.id).update({
          status: "progress"
        })
      }
    },
    logDone(args) {
      if(args['added']){
        this.$db.collection("kanban").doc(args['added'].element.id).update({
          status: "done"
        })
      }
    }
  }
};
</script>
<style scoped>
  .draggable-height{
    height: 200px;
  }
</style>
