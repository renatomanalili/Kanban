import Vue from 'vue'
import Router from 'vue-router'
import Kanban from './components/Kanban';
import Login from './components/Login';

Vue.use(Router)

export default new Router({
    routes: [
      {
        path: '/',
        name: 'home',
        component: Kanban,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: '/login',
        name: 'login',
        component: Login
      }
    ]
  })