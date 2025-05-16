import { createRouter, createWebHistory } from 'vue-router'
import EstudantesView from '../pages/EstudantesView.vue'
import DocentesView from '../pages/DocentesView.vue'
import AsignaturasView from '../pages/AsignaturasView.vue' // ← corregido

const routes = [
  {
    path: '/estudantes',
    name: 'Estudantes',
    component: EstudantesView,
    meta: { requiresAuth: true }
  },
  {
    path: '/docentes',
    name: 'Docentes',
    component: DocentesView,
    meta: { requiresAuth: true }
  },
  {
    path: '/asignaturas',
    name: 'Asignaturas',
    component: AsignaturasView,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/LoginView.vue') // Crear esta vista para login
  },
  {
    path: '/',
    redirect: '/estudantes'
  }
]

export default router
