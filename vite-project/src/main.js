import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router.js'  // include the correct path
import './style.css'

const app = createApp(App)
app.use(router)
app.mount('#app')
