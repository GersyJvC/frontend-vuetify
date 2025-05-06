import { createRouter, createWebHistory } from 'vue-router'
import EstudantesView from '../pages/EstudantesView.vue'
import DocentesView from '../pages/DocentesView.vue'
import AsignaturasView from '../pages/AsignaturasView.vue' // ← corregido

const routes = [
  {
    path: '/estudantes',
    name: 'Estudantes',
    component: EstudantesView
  },
  {
    path: '/docentes',
    name: 'Docentes',
    component: DocentesView
  },
  {
    path: '/asignaturas',
    name: 'Asignaturas',
    component: AsignaturasView // ← nueva vista
  },
  {
    path: '/',
    redirect: '/estudantes'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
