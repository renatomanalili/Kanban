<template>
  <v-container>
    <v-row>
      <v-col cols="4">
        <v-btn small color="blue" class="white--text"  @click.stop = "dialog = true">What do you want to do?</v-btn>
      </v-col>
      <v-col cols="8">
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
      <v-col cols="4">
        To Do
        <draggable class="draggable-height" :list="todo" group="todo" @change="logTodo">
          <v-card  v-for="(element,index) in todo"
            :key="element.data.name" class="pa-3 mb-2 white--text" color="#616161">
            {{ element.data.name }}<v-btn style="float:right" text icon color="#D50000" @click="deleteTodo(element.id,index,'todo')"><v-icon class="mb-3">mdi-delete</v-icon></v-btn><v-btn style="float:right" text icon color="#FFFF00" @click="displayTodo(index,'todo')"><v-icon class="mb-3">mdi-eye-outline</v-icon></v-btn>
          </v-card>
        </draggable>
      </v-col>
      <v-col cols="4">
        In Progress
        <draggable class="draggable-height" :list="progress" group="todo" @change="logProgress">
          <v-card  v-for="(element,index) in progress"
            :key="element.data.name" class="pa-3 mb-2 white--text" color="#42A5F5">
            {{ element.data.name }}<v-btn style="float:right" text icon color="#D50000" @click="deleteTodo(element.id,index,'progress')"><v-icon class="mb-3">mdi-delete</v-icon></v-btn><v-btn style="float:right" text icon color="#FFFF00" @click="displayTodo(index,'progress')"><v-icon class="mb-3">mdi-eye-outline</v-icon></v-btn>
          </v-card>
        </draggable>
      </v-col>
    <v-col cols="4">
       Done
      <draggable class="draggable-height" :list="done" group="todo" @change="logDone">
        <v-card  v-for="element in done"
          :key="element.data.name" class="pa-3 mb-2 white--text" color="#FFAB40" :disabled="true">
          {{ element.data.name }}<v-icon style="float:right" color="#1B5E20">mdi-check-circle</v-icon><v-btn style="float:right" text icon color="#FFFF00" @click="displayTodo(index,'done')"><v-icon class="mb-3">mdi-eye-outline</v-icon></v-btn>
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
          <div v-if="doneDetails" v-for="(done,index) in doneDetails" :key="index">
            <p>Status: {{done.status}}</p>
            <p>Name: {{done.name}}</p>
            <p>Start Date: {{done.startDate}}</p>
            <p>End Date: {{done.endDate}}</p>
          </div>
        </v-card-text>
      </v-card>
  </v-dialog>
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
    doneDetails: [],
    dialogs: false
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
    submit() {
      this.$db.collection("kanban").add({
        name: this.name,
        user: this.store.state.user.id,
        status: 'todo',
        startDate: '',
        endDate: ''
      }).then((res)=>{
        this.dialog = false
        this.name = ''
      })
    },
    read() {
      this.$db.collection("kanban").onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
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
            if(change.doc.data().user == this.store.state.user.id) {
              if(change.doc.data().status == 'todo') {
                let index = this.todo.findIndex(x=> x.id == change.doc.id)
              
                this.todo.splice(index,1,{
                  data: change.doc.data(),
                  id: change.doc.id
                })
                let progress = this.progress.filter(zz=>{
                  return zz
                })
                
                  this.progress = []
                 progress.forEach(cc=>{
                   this.progress.push({
                     data: cc.data,
                     id: cc.id
                   })
                 })
                
              }else if(change.doc.data().status == 'progress') {
                let index = this.progress.findIndex(x=> x.id == change.doc.id)
                this.progress.splice(index,1,{
                  data: change.doc.data(),
                  id: change.doc.id
                })
                let todo = this.todo.filter(zz=>{
                  return zz
                })
      
                  this.todo = []
                 todo.forEach(cc=>{
                   this.todo.push({
                     data: cc.data,
                     id: cc.id
                   })
                 })
              
              }else if(change.doc.data().status == 'done') {
                let index = this.progress.findIndex(x=> x.id == change.doc.id)
                this.done.splice(index,1,{
                  data: change.doc.data(),
                  id: change.doc.id
                })
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
          if(status == 'todo') {
            this.todo.splice(index,1)
            this.deleted = true
          }else if(status == 'progress'){
            this.progress.splice(index,1)
            this.deleted = true
          }
        })
    },
    displayTodo(index, status) {
      this.dialogs = true
      this.todoDetails = []
      this.progressDetails = []
      this.doneDetails = []
      if(status == 'todo') {
        this.todoDetails.push(this.todo[index].data)
      }else if(status == 'progress') {
        this.progressDetails.push(this.progress[index].data)
      }else if(status == 'done') {
        this.doneDetails.push(this.done[index].data)
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
    height: 1000px;
  }
</style>
