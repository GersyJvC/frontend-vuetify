import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { createPinia } from 'pinia'  // <-- Importa Pinia

const vuetify = createVuetify({ components, directives })
const pinia = createPinia()          // <-- Crea instancia de Pinia

createApp(App)
  .use(router)
  .use(pinia)           // <-- Usa Pinia
  .use(vuetify)
  .mount('#app')
