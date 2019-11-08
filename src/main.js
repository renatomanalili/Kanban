import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/firestore';
import router from './router'
import store from './store'
Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.$axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

const config = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_FIREBASE_MESSAGE_SENDER_ID,
}
const fb = firebase.initializeApp(config)
Vue.prototype.$fb = fb;
Vue.prototype.$db = firebase.firestore()
Vue.prototype.firebase = firebase
Vue.prototype.store = store

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser;
  const requiresAuth = to.matched.some(recored => recored.meta.requiresAuth)
  if(requiresAuth && !currentUser) next('login');
  else if (!requiresAuth && currentUser) next('home');
  else next();
})
let app
firebase.auth().onAuthStateChanged(user => {
  if(!app) {
    app = new Vue({
      vuetify,
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
  if(user) {
    store.commit('addUser',{
      id: user.uid,
      name: user.displayName,
      photo: user.photoURL,
      email: user.email
    })
  } else {
    store.commit('addUser',[])
  }
})

