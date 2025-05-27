import { createApp } from 'vue'
import './style.css'
import './styles/reset.css'
import App from './App.vue'
import router from './router'
import pinia from './store'

import Worker from './worker?worker'
const worker = new Worker()
worker.onmessage = function (e) {
  console.log('e', e)
}
const app = createApp(App)
app.use(router)
app.use(pinia)
app.mount('#app')
