import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { router } from './router'
import './assets/styles/base.css'

/* Enregistre les données de démonstration. Sans backend configuré, c'est ce
   module qui répond aux appels de `request()` ; avec un backend, il ne sert plus. */
import './api/mock'

createApp(App).use(createPinia()).use(router).mount('#app')
