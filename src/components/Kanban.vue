<template>
  <v-container>
    <v-row>
      <v-col cols="4">
        <v-btn small color="blue" class="white--text"  @click.stop = "dialog = true"><span class="text-truncate">Add Todo</span></v-btn>
      </v-col>
      <v-col sm="8" cols="12">
        <div>
          Total Task: {{ totalTasks }} | Completed task: {{ completedTasks }}
                  <v-progress-circular
        :value="progressCircle" :size="55" class="ml-3" color="red">{{ Math.floor(progressCircle) }}%</v-progress-circular>
        </div>
      </v-col>
    </v-row>
    <v-alert
      border="top"
      color="red lighten-2"
      dark
      class="mt-2"
      :value="deleted"
      transition="fade-transition"
    >
      Successfully Deleted
    </v-alert>
    <v-row>
      <v-col sm="4" cols="12" style="height: 250px;">
        To Do
        <draggable class="draggable-height" :list="todo" group="todo" @change="logTodo">
          <v-card  v-for="(element,index) in todo"
            :key="index" class="pa-3 mb-2 white--text" color="#616161">
            {{ element.data.name }}<v-btn style="float:right" text icon color="#D50000" @click.native="deleteTodo(element.id,index,'todo')"><v-icon class="mb-3">mdi-delete</v-icon></v-btn><v-btn style="float:right" text icon color="#FFFF00" @click.native="displayTodo(index,'todo')"><v-icon class="mb-3">mdi-eye-outline</v-icon></v-btn>
          </v-card>
        </draggable>
      </v-col>
      <v-col sm="4" cols="12">
        In Progress
        <draggable class="draggable-height" :list="progress" group="todo" @change="logProgress">
          <v-card  v-for="(element,index) in progress"
            :key="index" class="pa-3 mb-2 white--text" color="#42A5F5">
            {{ element.data.name }}<v-btn style="float:right" text icon color="#D50000" @click.native="deleteTodo(element.id,index,'progress')"><v-icon class="mb-3">mdi-delete</v-icon></v-btn><v-btn style="float:right" text icon color="#FFFF00" @click.native="displayTodo(index,'progress')"><v-icon class="mb-3">mdi-eye-outline</v-icon></v-btn>
          </v-card>
        </draggable>
      </v-col>
    <v-col sm="4" cols="12">
       Done
      <draggable class="draggable-height" :list="done" group="todo" @change="logDone">
        <v-card  v-for="(element,index) in done"
          :key="index" class="pa-3 mb-2 white--text" color="#FFAB40" :disabled="true">
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
        <v-overlay
          :absolute="true"
          :value="addOverlay"
        >
        <v-progress-circular indeterminate size="32"></v-progress-circular>
        </v-overlay>
      </v-card>
      </v-dialog>
    <div class="text-center">
    <v-bottom-sheet v-model="approved" persistent inset>
      <v-progress-linear
          :value="50"
          class="my-0"
          height="3"
        ></v-progress-linear>
      <v-sheet class="text-center" height="200px">
        <div class="py-3">Are you done with this task?</div>
        <v-btn
          class="mt-6"
          text
          color="error"
          @click="todoDone(true)"
        >Yes</v-btn>
        <v-btn
          class="mt-6"
          text
          color="error"
          @click="todoDone(false)"
        >No</v-btn>
      </v-sheet>
    </v-bottom-sheet>
  </div>
  <!-- Modal  -->
  <v-dialog v-model="dialogs" max-width="290">
      <v-card>
        <v-card-title class="headline">Kanban Details</v-card-title>
        <v-card-text>
          <div v-if="todoDetails" v-for="(todo,index) in todoDetails" :key="index">
            <p>Status: {{todo.status}}</p>
            <p>Name: {{todo.name}}</p>
          </div>
          <div v-if="progressDetails" v-for="(progress,index) in progressDetails" :key="index">
            <p>Status: {{progress.status}}</p>
            <p>Name: {{progress.name}}</p>
            <p>Start Date: {{progress.startDate}}</p>
          </div>
        </v-card-text>
      </v-card>
  </v-dialog>
  <!-- OVERLAY -->
  <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
  </v-overlay>
  </v-container>
</template>

<script>
import draggable from "vuedraggable"
import moment from 'moment'
export default {
  components: {
    draggable
  },
  data: () => ({
    name: '',
    dialog: false,
    todo: [],
    progress: [],
    done: [],
    deleted: false,
    approved: false,
    approvedDone: false,
    dataWithDone: [],
    todoDetails: [],
    progressDetails: [],
    dialogs: false,
    overlay: true,
    addOverlay: false
  }),
  created() {
    this.read()
  },
  watch: {
    deleted(val){
      if(val){
        setTimeout(() => {
          this.deleted = false
        }, 2000)
      }
    },
    done: {
      handler(finished) {
        finished.forEach(val => {
          if(moment(val.data.endDate, "MMMM Do YYYY, h:mm:ss a").fromNow() == '15 days ago') {
            this.$db.collection("kanban").doc(val.id).delete()
            .then(()=>{
                let index = this.done.findIndex(x=> x.id == val.id)
                this.done.splice(index,1)
            })
          }
        })
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    submit(e) {
      this.addOverlay = true
      this.$db.collection("kanban").add({
        name: this.name,
        user: this.store.state.user.id,
        status: 'todo',
        startDate: '',
        endDate: ''
      }).then((res)=>{
        this.dialog = false
        this.name = ''
        this.addOverlay = false
      })
    },
    async read() {
      await this.$db.collection("kanban").onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          this.overlay = false
          if(change.type == 'added') {
            if(change.doc.data().user == this.store.state.user.id) {
              if(change.doc.data().status == 'todo') {
                this.todo.push ({
                  data: change.doc.data(),
                  id: change.doc.id
                })
              }else if(change.doc.data().status == 'progress') {
                this.progress.push ({
                  data: change.doc.data(),
                  id: change.doc.id
                })
              }else if(change.doc.data().status == 'done') {
                this.done.push ({
                  data: change.doc.data(),
                  id: change.doc.id
                })
              }
            }
          }
          if(change.type == 'modified') {
            const source = change.doc.metadata.hasPendingWrites ? "Local" : "Server"
            if(source == "Server") {
              if(change.doc.data().user == this.store.state.user.id) {
                if(change.doc.data().status == 'todo') {
                  let progIndex = this.progress.findIndex(x=> {return x.id == change.doc.id})
                  this.todo.push({
                    data: change.doc.data(),
                    id: change.doc.id
                  })
                  this.progress.splice(progIndex,1)
                }else if(change.doc.data().status == 'progress') {
                  let todoIndex = this.todo.findIndex(x=> {return x.id == change.doc.id})
                  this.progress.push({
                    data: change.doc.data(),
                    id: change.doc.id
                  })
                  this.todo.splice(todoIndex,1)
                }else if(change.doc.data().status == 'done') {
                  let progIndex = this.progress.findIndex(x=> x.id == change.doc.id)
                  let todoIndex = this.todo.findIndex(x=> x.id == change.doc.id)
                  if(progIndex > -1) {
                    this.progress.splice(progIndex,1)
                  }
                  if(todoIndex > -1) {
                    this.todo.splice(todoIndex,1)
                  }
                  this.done.push({
                    data: change.doc.data(),
                    id: change.doc.id
                  })
                  
                }
              }
            } else if( source == "Local") {
              if(change.doc.data().user == this.store.state.user.id) {
                if(change.doc.data().status == 'todo') {
                  this.todo.forEach(t=>{
                    if(t.id == change.doc.id) {
                      t.data = change.doc.data()
                    }
                  })
                }else if(change.doc.data().status == 'progress') {
                  this.progress.forEach((p,i)=>{
                    if(p.id == change.doc.id) {
                      p.data = change.doc.data()
                    }
                  })
                }else if(change.doc.data().status == 'done') {
                  
                }
              }
            }
          } 
          if(change.type == 'removed') {
            let status = ['todo','progress','done']
            let cute = change.doc.data().status
            
            let currentStatus = status.find(val=>{
              return val == cute
            })

            if(currentStatus == 'todo') {
              let index = this.todo.findIndex(val=>{
                return val.id == change.doc.id
              })
              this.todo.splice(index,1)
              this.deleted = true
            }else if(currentStatus == 'progress') {
              let index = this.progress.findIndex(val=>{
                return val.id == change.doc.id
              })
              this.progress.splice(index,1)
              this.deleted = true
            }
          } 
        })
      })

      if(this.todo.length == 0 && this.progress.length == 0 && this.done.length == 0) {
        this.overlay = false
      }
    },
    logTodo(args) {
      if(args['added']){
        this.$db.collection("kanban").doc(args['added'].element.id).update({
          status: "todo",
          startDate: '',
          endDate: ''
        })
      }
    },
    logProgress(args) {
      if(args['added']){
        this.$db.collection("kanban").doc(args['added'].element.id).update({
          status: "progress",
          startDate: moment().format('MMMM Do YYYY, h:mm:ss a'),
          endDate: ''
        })
      }
    },
    logDone(args) {
      this.approved = true
      if(args['added']){
        this.dataWithDone = args['added'].element
      }
    },
    deleteTodo(id,index,status) {
      this.$db.collection("kanban").doc(id).delete()
        .then(()=>{
        })
    },
    displayTodo(index, status) {
      this.dialogs = true
      this.todoDetails = []
      this.progressDetails = []
      if(status == 'todo') {
        this.todoDetails.push(this.todo[index].data)
      }else if(status == 'progress') {
        this.progressDetails.push(this.progress[index].data)
      }
    },
    todoDone(status) {
      this.approved = false
      if(status){
        this.$db.collection("kanban").doc(this.dataWithDone.id).update({
          status: "done",
          endDate: moment().format('MMMM Do YYYY, h:mm:ss a')
        })
      } else {
        this.$db.collection("kanban").doc(this.dataWithDone.id).update({
          status: "todo",
          startDate: '',
          endDate: ''
        })
        this.done.splice(this.done.length-1,1)
        this.todo.push(this.dataWithDone)
      }
    }
  },
  computed: {
    totalTasks() {
      return this.todo.length + this.done.length + this.progress.length
    },
    completedTasks() {
      return this.done.length
    },
    progressCircle() {
      return this.completedTasks / this.totalTasks * 100
    }
  }
};
</script>
<style scoped>
  .draggable-height{
    max-height: 500px;
    overflow-y: auto;
  }
</style>
