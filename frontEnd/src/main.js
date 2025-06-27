import { createApp } from 'vue'
import { Quasar, Notify } from 'quasar'
import { createPinia } from 'pinia'
import { router } from './routes/routes.js'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import axios from 'axios';
import App from './App.vue'

axios.defaults.withCredentials = true;

const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

const myApp = createApp(App)

myApp.use(router)
myApp.use(Quasar, {
  plugins: { Notify }
})
myApp.use(pinia)
myApp.component('font-awesome-icon', FontAwesomeIcon)
myApp.mount('#app')
