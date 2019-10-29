import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import * as firebase from 'firebase'

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
new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
